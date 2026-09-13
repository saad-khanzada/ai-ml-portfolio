import {defineQuery} from 'next-sanity'

export const PROJECT_CATEGORIES_QUERY = defineQuery(`
  *[_type == "projectCategory"]
  | order(coalesce(displayOrder, 2147483647) asc, title asc, _id asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    displayOrder
  }
`)

export const SKILLS_QUERY = defineQuery(`
  *[_type == "skill"]
  | order(coalesce(displayOrder, 2147483647) asc, name asc, _id asc) {
    _id,
    name,
    category,
    displayOrder,
    "featured": coalesce(featured, false),
    level,
    icon {
      _type,
      asset,
      alt,
      crop,
      hotspot
    }
  }
`)

export const PROFILE_QUERY = defineQuery(`
  *[_type == "profile" && _id == $profileId][0] {
    _id,
    name,
    headline,
    introduction,
    bio,
    profileImage,
    email,
    location,
    resume {
      asset-> {
        _id,
        url,
        originalFilename,
        mimeType,
        size
      }
    },
    githubUrl,
    linkedinUrl,
    huggingFaceUrl,
    additionalSocialLinks,
    education,
    projectsCtaText,
    resumeCtaText,
    contactCtaHeading,
    contactCtaText,
    footerTagline,
    footerText,
    siteTitle,
    seoTitle,
    seoDescription,
    socialImage
  }
`)

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"]
  | order(projectDate desc, _id asc) {
    _id,
    title,
    summary,
    "slug": slug.current,
    coverImage,
    projectDate,
    "featured": coalesce(featured, false),
    tags,
    primaryCategory-> {
      _id,
      title,
      "slug": slug.current
    },
    technologies[]-> {
      _id,
      name,
      category
    }
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && slug.current == $slug]
  | order(_id asc) [0] {
    _id,
    title,
    summary,
    "slug": slug.current,
    coverImage,
    projectDate,
    "featured": coalesce(featured, false),
    tags,
    primaryCategory-> {
      _id,
      title,
      "slug": slug.current
    },
    technologies[]-> {
      _id,
      name,
      category
    },
    problem,
    objective,
    approach,
    content,
    results,
    metrics,
    screenshots,
    challenges,
    whatILearned,
    githubUrl,
    liveDemoUrl,
    huggingFaceUrl,
    notebookUrl,
    datasetUrl,
    videoUrl,
    seoTitle,
    seoDescription
  }
`)

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]
  | order(publishedAt desc, _id asc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    coverImage,
    publishedAt,
    tags,
    "featured": coalesce(featured, false),
    author-> {
      _id,
      name
    }
  }
`)

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current) && slug.current == $slug]
  | order(_id asc) [0] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    coverImage,
    body,
    publishedAt,
    tags,
    "featured": coalesce(featured, false),
    author-> {
      _id,
      name,
      headline,
      profileImage
    },
    relatedProject-> {
      _id,
      title,
      summary,
      "slug": slug.current,
      coverImage
    },
    seoTitle,
    seoDescription
  }
`)

export const EXPERIENCE_QUERY = defineQuery(`
  *[_type == "experience"]
  | order(coalesce(isCurrent, false) desc, startDate desc, _id asc) {
    _id,
    "featuredOnHome": coalesce(featuredOnHome, false),
    role,
    organization,
    employmentType,
    startDate,
    endDate,
    "isCurrent": coalesce(isCurrent, false),
    location,
    workplaceType,
    description,
    responsibilities,
    skills[]-> {
      _id,
      name,
      category
    },
    organizationLogo,
    externalUrl
  }
`)

export const CERTIFICATIONS_QUERY = defineQuery(`
  *[_type == "certification"]
  | order(coalesce(featured, false) desc, issueDate desc, _id asc) {
    _id,
    title,
    provider,
    issueDate,
    credentialId,
    credentialUrl,
    certificateImage,
    skills[]-> {
      _id,
      name,
      category
    },
    "featured": coalesce(featured, false)
  }
`)
