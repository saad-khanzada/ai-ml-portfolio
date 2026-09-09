import Image from 'next/image'
import type {ContentImage} from '@/types/sanity.generated'
import {getImageUrl} from '@/sanity/lib/image'
import styles from './ProfileImage.module.css'

type ProfileImageProps = {
  image?: ContentImage | null
  name?: string | null
  sizes: string
  preload?: boolean
}

export function ProfileImage({
  image,
  name,
  sizes,
  preload = false,
}: ProfileImageProps) {
  const alt = image?.alt?.trim() ||
    (name?.trim() ? `Portrait of ${name.trim()}` : '')

  const src = getImageUrl(image, {width: 960, height: 1200})

  if (!src || !alt) return null

  return (
    <Image
      className={styles.portrait}
      src={src}
      alt={alt}
      width={960}
      height={1200}
      sizes={sizes}
      preload={preload}
    />
  )
}
