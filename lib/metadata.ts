import 'server-only'

import type {Metadata} from 'next'
import type {ContentImage} from '@/types/sanity.generated'
import {getProfile, getProjectBySlug, getBlogPostBySlug} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {getImageUrl} from '@/sanity/lib/image'

export const SITE_ORIGIN = 'https://saadkabeer.online'

const FALLBACK_TITLE = 'AI/ML Portfolio'
const FALLBACK_DESCRIPTION =
  'Projects, technical writing and professional experience in AI, machine learning and Python.'

type PageMetadataOptions = {
  path: string
  title?: string | null
  description?: string | null
  image?: ContentImage | null
  article?: boolean
  author?: string | null
  publishedAt?: string | null
}

function socialImage(image: ContentImage | null | undefined) {
  const alt = image?.alt?.trim()
  if (!alt) return null
  const url = getImageUrl(image, {width: 1200, height: 630})
  return url ? {url, width: 1200, height: 630, alt} : null
}

export async function getPageMetadata({
  path, title, description, image, article = false, author, publishedAt,
}: PageMetadataOptions): Promise<Metadata> {
  let profile: Awaited<ReturnType<typeof getProfile>> = null

  try {
    profile = await getProfile()
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    // Metadata can use neutral defaults; page-level CMS error handling remains intact.
  }

  const siteName = profile?.siteTitle?.trim() ||
    (profile?.name?.trim() ? profile.name.trim() + ' | AI/ML Portfolio' : FALLBACK_TITLE)

  const pageTitle = title?.trim()
  const resolvedTitle = pageTitle
    ? pageTitle + ' | ' + siteName
    : profile?.seoTitle?.trim() || siteName

  const resolvedDescription = description?.trim() ||
    profile?.seoDescription?.trim() || FALLBACK_DESCRIPTION

  const sharingImage = socialImage(image) || socialImage(profile?.socialImage)
  const images = sharingImage ? [sharingImage] : []
  const url = new URL(path, SITE_ORIGIN).href

  const timestamp = publishedAt ? new Date(publishedAt) : null
  const publishedTime = timestamp && Number.isFinite(timestamp.getTime())
    ? timestamp.toISOString()
    : undefined

  const commonOpenGraph = {
    title: resolvedTitle,
    description: resolvedDescription,
    url,
    siteName,
    images,
  }

  return {
    title: {absolute: resolvedTitle},
    description: resolvedDescription,
    alternates: {canonical: url},
    openGraph: article
      ? {
          ...commonOpenGraph,
          type: 'article',
          publishedTime,
          authors: author?.trim() ? [author.trim()] : undefined,
        }
      : {...commonOpenGraph, type: 'website'},
    twitter: {
      card: sharingImage ? 'summary_large_image' : 'summary',
      title: resolvedTitle,
      description: resolvedDescription,
      images,
    },
  }
}

export async function getDetailMetadata(
  kind: 'project' | 'blog',
  slug: string,
): Promise<Metadata> {
  try {
    if (kind === 'project') {
      const project = await getProjectBySlug(slug)
      if (!project?.title?.trim()) {
        return {
          title: 'Project not found',
          robots: {index: false, follow: true},
        }
      }
      return getPageMetadata({
        path: '/projects/' + slug,
        title: project.seoTitle?.trim() || project.title,
        description: project.seoDescription?.trim() || project.summary,
        image: project.coverImage,
      })
    }

    const post = await getBlogPostBySlug(slug)
    if (!post?.title?.trim()) {
      return {
        title: 'Article not found',
        robots: {index: false, follow: true},
      }
    }
    return getPageMetadata({
      path: '/blog/' + slug,
      title: post.seoTitle?.trim() || post.title,
      description: post.seoDescription?.trim() || post.excerpt,
      image: post.coverImage,
      article: true,
      author: post.author?.name,
      publishedAt: post.publishedAt,
    })
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return {
      title: kind === 'project' ? 'Project temporarily unavailable' : 'Article temporarily unavailable',
      robots: {index: false, follow: true},
    }
  }
}
