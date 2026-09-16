import type {ComponentProps, ReactNode} from 'react'
import {PortableText} from 'next-sanity'
import type {RichText as RichTextValue} from '@/types/sanity.generated'
import {ContentImage, imagePresentation} from './ContentImage'
import styles from './Content.module.css'

export function safeContentUrl(value: unknown, allowMail = false): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    const allowed = url.protocol === 'https:' || url.protocol === 'http:' ||
      (allowMail && url.protocol === 'mailto:')
    if (!allowed || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}

export function hasRichText(value: RichTextValue | null | undefined, projectImages = false): boolean {
  return Boolean(value?.some((item) => {
    if (item._type === 'block') {
      return item.children?.some((span) => span.text?.trim())
    }
    if (item._type === 'codeBlock') return Boolean(item.code?.trim())
    if (item._type === 'contentImage') return Boolean(imagePresentation(item, projectImages))
    return false
  }))
}

type CodeValue = Extract<RichTextValue[number], {_type: 'codeBlock'}>
type ImageValue = Extract<RichTextValue[number], {_type: 'contentImage'}>

const components = {
  types: {
    contentImage: ({value}: {value: ImageValue}) => <ContentImage image={value} />,
    codeBlock: ({value}: {value: CodeValue}) => {
      if (!value.code?.trim()) return null
      return (
        <figure className={styles.codeBlock}>
          {(value.filename?.trim() || value.language?.trim()) && (
            <figcaption>
              {[value.filename?.trim(), value.language?.trim()].filter(Boolean).join(' \u00B7 ')}
            </figcaption>
          )}
          <pre tabIndex={0} aria-label={value.filename?.trim() || 'Code example'}>
            <code>{value.code}</code>
          </pre>
        </figure>
      )
    },
  },
  marks: {
    link: ({value, children}: {value?: {href?: string}; children?: ReactNode}) => {
      const href = safeContentUrl(value?.href, true)
      return href ? <a href={href}>{children}</a> : <>{children}</>
    },
  },
} satisfies NonNullable<ComponentProps<typeof PortableText>['components']>

const screenshotComponents = {
  ...components,
  types: {
    ...components.types,
    contentImage: ({value}: {value: ImageValue}) => (
      <ContentImage image={value} variant="projectScreenshot" />
    ),
  },
} satisfies NonNullable<ComponentProps<typeof PortableText>['components']>

export function RichText({
  value,
  projectImages = false,
  screenshotImages = false,
}: {
  value: RichTextValue | null | undefined
  projectImages?: boolean
  screenshotImages?: boolean
}) {
  const useScreenshotImages = projectImages || screenshotImages
  if (!value || !hasRichText(value, useScreenshotImages)) return null
  return (
    <div className={projectImages ? styles.prose + ' ' + styles.projectProse : styles.prose}>
      <PortableText value={value} components={useScreenshotImages ? screenshotComponents : components} />
    </div>
  )
}
