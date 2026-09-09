import 'server-only'

import {cache} from 'react'
import {PROFILE_DOCUMENT_ID} from '../constants'
import {fetchPublishedQuery} from './fetch'
import {
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_QUERY,
  CERTIFICATIONS_QUERY,
  EXPERIENCE_QUERY,
  PROFILE_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_CATEGORIES_QUERY,
  PROJECTS_QUERY,
  SKILLS_QUERY,
} from './queries'

function isValidSlug(slug: string): boolean {
  return slug.length <= 96 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export const getProjectCategories = cache(() =>
  fetchPublishedQuery(PROJECT_CATEGORIES_QUERY),
)

export const getSkills = cache(() =>
  fetchPublishedQuery(SKILLS_QUERY),
)

export const getProfile = cache(() =>
  fetchPublishedQuery(PROFILE_QUERY, {profileId: PROFILE_DOCUMENT_ID}),
)

export const getProjects = cache(() =>
  fetchPublishedQuery(PROJECTS_QUERY),
)

export const getProjectBySlug = cache(async (slug: string) => {
  if (!isValidSlug(slug)) return null
  return fetchPublishedQuery(PROJECT_BY_SLUG_QUERY, {slug})
})

export const getBlogPosts = cache(() =>
  fetchPublishedQuery(BLOG_POSTS_QUERY),
)

export const getBlogPostBySlug = cache(async (slug: string) => {
  if (!isValidSlug(slug)) return null
  return fetchPublishedQuery(BLOG_POST_BY_SLUG_QUERY, {slug})
})

export const getExperience = cache(() =>
  fetchPublishedQuery(EXPERIENCE_QUERY),
)

export const getCertifications = cache(() =>
  fetchPublishedQuery(CERTIFICATIONS_QUERY),
)
