import Link from 'next/link'
import type {EXPERIENCE_QUERY_RESULT} from '@/types/sanity.generated'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {contentDate} from '@/lib/contentDate'
import styles from './HomeSections.module.css'

export function ExperienceSnapshot({
  experience,
}: {
  experience: EXPERIENCE_QUERY_RESULT
}) {
  const entries = experience
    .filter((entry) => entry.featuredOnHome && entry.role?.trim() && entry.organization?.trim())
    .slice(0, 2)

  if (entries.length === 0) return null

  return (
    <section
      aria-labelledby="experience-heading"
      className="site-container site-section"
    >
      <SectionHeading id="experience-heading" title="Selected experience" />
      <div className={styles.selectedExperience}>
        {entries.map((entry) => {
          const start = contentDate(entry.startDate)
          const end = contentDate(entry.endDate)
          const location = entry.location?.trim()

          return (
            <article key={entry._id} className={styles.entry}>
              <h3 className={styles.title}>{entry.role?.trim()}</h3>
              <p className={styles.organization}>{entry.organization?.trim()}</p>
              {(start || entry.isCurrent || location) && (
                <div className={styles.meta}>
                  {(start || entry.isCurrent) && (
                    <span>
                      {start && <time dateTime={start.dateTime}>{start.label}</time>}
                      {start && (entry.isCurrent || end) && ' - '}
                      {entry.isCurrent ? 'Present' : start && end ? (
                        <time dateTime={end.dateTime}>{end.label}</time>
                      ) : null}
                    </span>
                  )}
                  {location && <span>{location}</span>}
                </div>
              )}

            </article>
          )
        })}
      </div>
      <Link className={styles.experienceLink} href="/experience">
        View full experience<span aria-hidden="true" style={{marginInlineStart: '0.35em'}}>{'\u2192'}</span>
      </Link>
    </section>
  )
}
