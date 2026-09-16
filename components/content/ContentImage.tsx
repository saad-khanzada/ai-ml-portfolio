import Image from 'next/image'
import type {CSSProperties} from 'react'
import type {ContentImage as ImageValue} from '@/types/sanity.generated'
import {getImageUrl, urlFor} from '@/sanity/lib/image'
import styles from './Content.module.css'

export function imagePresentation(image: ImageValue | null | undefined, includeFullSizeUrl = false) {
  const alt = image?.alt?.trim()
  const match = image?.asset?._ref?.match(/^image-.+-(\d+)x(\d+)-[a-z0-9]+$/i)
  if (!image || !alt || !match) return null

  const crop = image.crop
  const fractions = [
    crop?.left ?? 0, crop?.right ?? 0,
    crop?.top ?? 0, crop?.bottom ?? 0,
  ]
  if (fractions.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    return null
  }

  const width = Number(match[1]) * (1 - fractions[0] - fractions[1])
  const height = Number(match[2]) * (1 - fractions[2] - fractions[3])
  if (width <= 0 || height <= 0) return null

  // Preserve the saved composition; display sizing adds no further crop.
  const source = image
  const url = getImageUrl(source, {width: 1440})
  let originalUrl: string | undefined
  if (includeFullSizeUrl && url) {
    try {
      originalUrl = urlFor(source).url()
    } catch {
      return null
    }
  }
  return url ? {
    url,
    originalUrl,
    alt,
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  } : null
}

export function ContentImage({
  image,
  preload = false,
  variant = 'natural',
}: {
  image: ImageValue | null | undefined
  preload?: boolean
  variant?: 'natural' | 'cover' | 'projectScreenshot'
}) {
  const screenshot = variant === 'projectScreenshot'
  const natural = imagePresentation(image, screenshot)
  if (!natural) return null

  const coverUrl = variant === 'cover'
    ? getImageUrl(image, {width: 1440, height: 810})
    : null
  if (variant === 'cover' && !coverUrl) return null

  const presentation = coverUrl
    ? {...natural, url: coverUrl, width: 1440, height: 810}
    : natural

  const ratio = presentation.width / presentation.height
  const orientation = ratio < 0.6
    ? 'tall'
    : ratio < 0.9
      ? 'portrait'
      : ratio <= 1.15
        ? 'square'
        : 'landscape'

  const size = image?.displaySize
  const autoWidth = orientation === 'tall' ? 22
    : orientation === 'portrait' ? 26
      : orientation === 'square' ? 36 : 56
  const presetWidth = size === 'compact' ? 28
    : size === 'standard' ? 42
      : size === 'wide' ? 56 : autoWidth

  // Bound figure width; image height follows its original aspect ratio.
  // Captions remain aligned with the displayed image.
  const screenshotStyle = screenshot ? {
    '--screenshot-native-width': presentation.width + 'px',
    '--screenshot-preset-width': presetWidth + 'rem',
    '--screenshot-mobile-width': (26 * ratio) + 'rem',
    '--screenshot-desktop-width': (32 * ratio) + 'rem',
  } as CSSProperties : undefined

  const caption = image?.caption?.trim()
  const desktopWidth = Math.ceil(Math.min(
    presentation.width, presetWidth * 16, 512 * ratio,
  ))

  return (
    <figure
      className={screenshot
        ? styles.figure + ' ' + styles.projectScreenshot
        : styles.figure}
      data-orientation={orientation}
      data-display-size={screenshot ? (size || 'auto') : undefined}
      style={screenshotStyle}
    >
      <Image
        src={presentation.url}
        alt={presentation.alt}
        width={presentation.width}
        height={presentation.height}
        sizes={screenshot
          ? '(min-width: 1024px) ' + desktopWidth + 'px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)'
          : '(min-width: 960px) 896px, 100vw'}
        preload={preload}
        className={styles.image}
      />
      {(caption || screenshot) && (
        <figcaption>
          {caption && <span>{caption}</span>}
          {screenshot && natural.originalUrl && (
            <a
              className={styles.fullImageLink}
              href={natural.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={'View full image: ' + presentation.alt + ' (opens in a new tab)'}
            >
              View full image <span aria-hidden="true">{'\u2197'}</span> (new tab)
            </a>
          )}
        </figcaption>
      )}
    </figure>
  )
}
