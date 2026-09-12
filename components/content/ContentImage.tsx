import Image from 'next/image'
import type {ContentImage as ImageValue} from '@/types/sanity.generated'
import {getImageUrl} from '@/sanity/lib/image'
import styles from './Content.module.css'

export function imagePresentation(image: ImageValue | null | undefined) {
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

  const url = getImageUrl(image, {width: 1440})
  return url ? {
    url,
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
  variant?: 'natural' | 'cover'
}) {
  const natural = imagePresentation(image)
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

  return (
    <figure className={styles.figure} data-orientation={orientation}>
      <Image
        src={presentation.url}
        alt={presentation.alt}
        width={presentation.width}
        height={presentation.height}
        sizes="(min-width: 960px) 896px, 100vw"
        preload={preload}
        className={styles.image}
      />
      {image?.caption?.trim() && <figcaption>{image.caption.trim()}</figcaption>}
    </figure>
  )
}
