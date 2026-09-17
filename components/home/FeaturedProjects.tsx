import type {PROJECTS_QUERY_RESULT} from '@/types/sanity.generated'
import {ProjectCard} from '@/components/ProjectCard'
import {SectionHeading} from '@/components/ui/SectionHeading'
import styles from './FeaturedProjects.module.css'

export function selectFeaturedProjects(projects: PROJECTS_QUERY_RESULT) {
  return projects
    .filter((project) => project.featured && project.title?.trim())
    .slice(0, 3)
}

export function FeaturedProjects({
  projects,
}: {
  projects: PROJECTS_QUERY_RESULT
}) {
  const featured = selectFeaturedProjects(projects)
  if (featured.length === 0) return null

  return (
    <section
      id="featured-projects"
      aria-labelledby="featured-projects-heading"
      className="site-container site-section"
    >
      <SectionHeading
        id="featured-projects-heading"
        title="Featured projects"
      />
      <div className={styles.grid}>
        {featured.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            variant="featured"
            sizes="(min-width: 1200px) 400px, (min-width: 768px) 50vw, 100vw"
          />
        ))}
      </div>
    </section>
  )
}
