import Image from 'next/image'
import Link from 'next/link'
import type {PROJECTS_QUERY_RESULT} from '@/types/sanity.generated'
import {Card} from '@/components/ui/Card'
import {SkillBadge} from '@/components/ui/SkillBadge'
import {getImageUrl} from '@/sanity/lib/image'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: PROJECTS_QUERY_RESULT[number]
  sizes: string
  enableDetailLink?: boolean
  variant?: 'featured' | 'listing'
}

export function ProjectCard({
  project,
  sizes,
  enableDetailLink = true,
  variant = 'featured',
}: ProjectCardProps) {
  const title = project.title?.trim()
  if (!title) return null

  const summary = project.summary?.trim()
  const category = project.primaryCategory?.title?.trim()
  const alt = project.coverImage?.alt?.trim()
  const imageUrl = alt
    ? getImageUrl(project.coverImage, {width: 1200, height: 750})
    : null
  const technologies = (project.technologies ?? []).filter(
    (skill) => skill?.name?.trim(),
  )
  const listing = variant === 'listing'
  const visibleTechnologies = listing ? technologies.slice(0, 3) : technologies
  const remainingTechnologies = technologies.length - visibleTechnologies.length
  const slug = project.slug
  const href = enableDetailLink && slug && slug.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ? '/projects/' + slug
    : null

  const content = (
    <>
      {category && <p className="site-label">{category}</p>}
      <h3 className={styles.title}>
        {href ? <Link className={styles.cardLink} href={href}>{title}</Link> : title}
      </h3>
      {summary && <p className={'site-copy ' + styles.summary}>{summary}</p>}
      {visibleTechnologies.length > 0 && (
        <ul className={styles.skills} aria-label="Technologies">
          {visibleTechnologies.map((skill) => (
            <li key={skill._id}>
              <SkillBadge name={skill.name!} />
            </li>
          ))}
          {remainingTechnologies > 0 && (
            <li>
              <span
                className={styles.moreTechnologies}
                aria-label={remainingTechnologies + ' more technologies'}
              >
                +{remainingTechnologies}
              </span>
            </li>
          )}
        </ul>
      )}
    </>
  )

  return (
    <Card data-variant={variant} className={[
      styles.card,
      listing ? styles.listing : '',
      href ? styles.clickableCard : '',
    ].filter(Boolean).join(' ')}>
      {imageUrl && alt && (
        <Image
          className={styles.image}
          src={imageUrl}
          alt={alt}
          width={1200}
          height={750}
          sizes={sizes}
        />
      )}
      {listing ? <div className={styles.listingBody}>{content}</div> : content}
    </Card>
  )
}
