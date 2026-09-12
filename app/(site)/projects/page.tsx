import type {Metadata} from 'next'
import Link from 'next/link'
import {ProjectCard} from '@/components/ProjectCard'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import {getProjects, getProjectCategories} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import styles from './Projects.module.css'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore projects, technologies and technical work.',
}

type ProjectsPageProps = {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

export default async function ProjectsPage({searchParams}: ProjectsPageProps) {
  const parameters = await searchParams
  const requestedCategory = parameters.category
  const hasFilter = requestedCategory !== undefined && requestedCategory !== ''

  let projects: Awaited<ReturnType<typeof getProjects>>
  let categories: Awaited<ReturnType<typeof getProjectCategories>>

  try {
    ;[projects, categories] = await Promise.all([
      getProjects(),
      getProjectCategories(),
    ])
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error

    return (
      <main id="main-content" tabIndex={-1} className="site-container site-section">
        <SectionHeading as="h1" title="Projects" />
        <EmptyState
          title="Projects are temporarily unavailable"
          description="Please try again shortly."
        />
        {/* Full-page navigation intentionally retries the failed CMS request. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="site-button site-button-secondary" href="/projects">
          Try again
        </a>
      </main>
    )
  }

  const availableCategories = categories.filter((category) =>
    category.title?.trim() &&
    category.slug &&
    category.slug.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug),
  )

  const selectedCategory = typeof requestedCategory === 'string'
    ? availableCategories.find((category) => category.slug === requestedCategory)
    : undefined
  const invalidFilter = hasFilter && !selectedCategory

  const displayableProjects = projects.filter((project) => project.title?.trim())
  const visibleProjects = invalidFilter
    ? []
    : selectedCategory
      ? displayableProjects.filter(
          (project) => project.primaryCategory?._id === selectedCategory._id,
        )
      : displayableProjects

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <SectionHeading as="h1" title="Projects" />

      {(availableCategories.length > 0 || hasFilter) && (
        <nav className={styles.filters} aria-label="Filter projects by category">
          <ul>
            <li>
              <Link
                href="/projects"
                aria-current={!hasFilter ? 'page' : undefined}
              >
                All projects
              </Link>
            </li>
            {availableCategories.map((category) => (
              <li key={category._id}>
                <a
                  href={'/projects?category=' + encodeURIComponent(category.slug!)}
                  aria-current={selectedCategory?._id === category._id
                    ? 'page'
                    : undefined}
                >
                  {category.title?.trim()}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {invalidFilter ? (
        <div className={styles.results}>
          <EmptyState
            title="Category unavailable"
            description="Choose one of the available categories or view all projects."
          />
          <Link className="site-button site-button-secondary" href="/projects">
            View all projects
          </Link>
        </div>
      ) : (
        <section aria-labelledby="project-results-heading" className={styles.results}>
          <h2 id="project-results-heading" className={styles.resultsHeading}>
            {selectedCategory?.title?.trim() || 'All projects'}
          </h2>
          <p className={styles.count}>
            {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}
          </p>

          {visibleProjects.length > 0 ? (
            <div className={styles.grid}>
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  sizes="(min-width: 1200px) 400px, (min-width: 768px) 50vw, 100vw"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              headingLevel="h3"
              title={selectedCategory
                ? 'No projects in this category yet'
                : 'No projects published yet'}
              description={selectedCategory
                ? 'Choose another category or view all projects.'
                : undefined}
            />
          )}
        </section>
      )}
    </main>
  )
}
