import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

type PortfolioImage = {
  asset?: {_ref?: string} | null
  crop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  } | null
  hotspot?: {
    x?: number
    y?: number
    width?: number
    height?: number
  } | null
}

type ImageUrlOptions = {
  width: number
  height?: number
}

export function getImageUrl(
  image: PortfolioImage | null | undefined,
  {width, height}: ImageUrlOptions,
): string | null {
  if (!image?.asset?._ref) return null

  if (!Number.isInteger(width) || width < 1) return null
  if (
    height !== undefined &&
    (!Number.isInteger(height) || height < 1)
  ) return null

  try {
    let request = urlFor(image).width(width).auto('format')

    if (height !== undefined) {
      request = request.height(height)
    } else {
      // Preserve the image aspect ratio and avoid enlarging small assets.
      request = request.fit('max')
    }

    return request.url()
  } catch {
    // An invalid asset reference must not break the surrounding page.
    return null
  }
}
