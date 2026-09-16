import {getDetailMetadata} from '@/lib/metadata'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {getProjectBySlug} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import {SkillBadge} from '@/components/ui/SkillBadge'
import {ContentImage, imagePresentation} from '@/components/content/ContentImage'
import {RichText, hasRichText, safeContentUrl} from '@/components/content/RichText'
import styles from './CaseStudy.module.css'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps) {
  const {slug} = await params
  return getDetailMetadata('project', slug)
}

export default async function ProjectPage({params}: PageProps) {
  const {slug} = await params
  let project: Awaited<ReturnType<typeof getProjectBySlug>>

  try {
    project = await getProjectBySlug(slug)
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return (
      <main id="main-content" tabIndex={-1} className="site-container site-section">
        <SectionHeading as="h1" title="Project temporarily unavailable" />
        <EmptyState
          title="The case study could not be loaded"
          description="Please try again shortly."
        />
        <a
          className="site-button site-button-secondary"
          href={'/projects/' + encodeURIComponent(slug)}
        >
          Try again
        </a>
      </main>
    )
  }

  if (!project || !project.title?.trim()) notFound()

  const sections = [
    {id: 'problem', title: 'Problem', value: project.problem},
    {id: 'objective', title: 'Objective', value: project.objective},
    {id: 'approach', title: 'Approach', value: project.approach},
    {id: 'implementation', title: 'Implementation', value: project.content},
    {id: 'results', title: 'Results', value: project.results},
    {id: 'challenges', title: 'Challenges', value: project.challenges},
    {id: 'lessons', title: 'What I learned', value: project.whatILearned},
  ].filter((section) => hasRichText(section.value, true))

  const metrics = (project.metrics ?? []).filter((metric) =>
    metric?.label?.trim() && metric?.value?.trim(),
  )
  const screenshots = (project.screenshots ?? []).filter((image) =>
    imagePresentation(image, true),
  )
  const technologies = (project.technologies ?? []).filter((skill) =>
    skill?.name?.trim(),
  )
  const tags = [...new Set(
    (project.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
  )]
  const links = [
    {label: 'GitHub', value: project.githubUrl},
    {label: 'Live demo', value: project.liveDemoUrl},
    {label: 'Hugging Face', value: project.huggingFaceUrl},
    {label: 'Notebook', value: project.notebookUrl},
    {label: 'Dataset', value: project.datasetUrl},
    {label: 'Video', value: project.videoUrl},
  ].map((link) => ({
    label: link.label,
    href: safeContentUrl(link.value),
  })).filter((link) => link.href)

  const date = project.projectDate ? new Date(project.projectDate) : null
  const validDate = date && Number.isFinite(date.getTime()) ? date : null

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <article className={styles.article}>
        <Link className={styles.back} href="/projects">Back to projects</Link>

        <header className={styles.header}>
          {project.primaryCategory?.title?.trim() && (
            <p className="site-label">{project.primaryCategory.title.trim()}</p>
          )}
          <h1 className={styles.title}>{project.title.trim()}</h1>
          {project.summary?.trim() && (
            <p className="site-copy">{project.summary.trim()}</p>
          )}
          {validDate && (
            <time
              className={styles.date}
              dateTime={validDate.toISOString().slice(0, 10)}
            >
              {new Intl.DateTimeFormat('en', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(validDate)}
            </time>
          )}
          {technologies.length > 0 && (
            <ul className={styles.badges} aria-label="Technologies">
              {technologies.map((skill) => (
                <li key={skill._id}>
                  <SkillBadge name={skill.name!} />
                </li>
              ))}
            </ul>
          )}
          {tags.length > 0 && (
            <ul className={styles.tags} aria-label="Project tags">
              {tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          {links.length > 0 && (
            <nav className={styles.links} aria-label="Project resources">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href!}
                  className="site-button site-button-secondary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <ContentImage image={project.coverImage} preload variant="cover" />

        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={'project-' + section.id}
            className={styles.section}
          >
            <h2 id={'project-' + section.id} className={styles.heading}>
              {section.title}
            </h2>
            <RichText value={section.value} projectImages />
          </section>
        ))}

        {metrics.length > 0 && (
          <section aria-labelledby="project-metrics" className={styles.section}>
            <h2 id="project-metrics" className={styles.heading}>Metrics</h2>
            <dl className={styles.metrics}>
              {metrics.map((metric) => (
                <div key={metric._key}>
                  <dt>{metric.label!.trim()}</dt>
                  <dd>
                    <span className={styles.metricValue}>
                      {metric.value!.trim()}
                    </span>
                    {metric.context?.trim() && <p>{metric.context.trim()}</p>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {screenshots.length > 0 && (
          <section aria-labelledby="project-gallery" className={styles.section}>
            <h2 id="project-gallery" className={styles.heading}>Screenshots</h2>
            <div className={styles.gallery}>
              {screenshots.map((image) => (
                <ContentImage key={image._key} image={image} variant="projectScreenshot" />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}
