import type {MetadataRoute} from 'next'
import {getProjects, getBlogPosts} from '@/sanity/lib/content'
import {SITE_ORIGIN} from '@/lib/metadata'

export const revalidate = 60

function validSlug(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Preserve CMS failures as errors rather than publishing a misleading partial sitemap.
  const [projects, posts] = await Promise.all([
    getProjects(),
    getBlogPosts(),
  ])

  const paths = new Set([
    '/', '/about', '/projects', '/experience', '/blog', '/contact',
  ])

  for (const project of projects) {
    if (project.title?.trim() && validSlug(project.slug)) {
      paths.add('/projects/' + project.slug)
    }
  }

  for (const post of posts) {
    if (post.title?.trim() && validSlug(post.slug)) {
      paths.add('/blog/' + post.slug)
    }
  }

  return [...paths].map(path => ({
    url: new URL(path, SITE_ORIGIN).href,
  }))
}
