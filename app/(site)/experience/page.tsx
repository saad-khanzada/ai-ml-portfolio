import {getPageMetadata} from '@/lib/metadata'
import type {Metadata} from 'next'
import {getExperience} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {ContentImage, imagePresentation} from '@/components/content/ContentImage'
import {safeContentUrl} from '@/components/content/RichText'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import {SkillBadge} from '@/components/ui/SkillBadge'
import {CmsUnavailable} from '@/components/info/CmsUnavailable'
import {contentDate} from '@/lib/contentDate'
import styles from '@/components/info/Info.module.css'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    path: '/experience',
    title: 'Experience',
    description: 'Professional experience, responsibilities and applied skills.',
  })
}

const employmentLabels: Record<string, string> = {
  'full-time': 'Full-time', 'part-time': 'Part-time', internship: 'Internship',
  contract: 'Contract', freelance: 'Freelance',
  'self-employed': 'Self-employed', volunteer: 'Volunteer',
}
const workplaceLabels: Record<string, string> = {
  remote: 'Remote', hybrid: 'Hybrid', 'on-site': 'On-site',
}

export default async function ExperiencePage() {
  let experience: Awaited<ReturnType<typeof getExperience>>
  try {
    experience = await getExperience()
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return <CmsUnavailable title="Experience" href="/experience" />
  }
  const entries = experience.filter((entry) =>
    entry.role?.trim() && entry.organization?.trim(),
  )

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <div className={styles.page}>
        <SectionHeading as="h1" title="Experience" />
        {entries.length === 0 ? (
          <EmptyState title="No experience published yet" />
        ) : (
          <div className={styles.entries}>
            {entries.map((entry) => {
              const start = contentDate(entry.startDate)
              const end = contentDate(entry.endDate)
              const href = safeContentUrl(entry.externalUrl)
              const responsibilities = (entry.responsibilities ?? [])
                .map((item) => item.trim()).filter(Boolean)
              const skills = (entry.skills ?? []).filter((skill) => skill?.name?.trim())
              const details = [
                entry.employmentType ? employmentLabels[entry.employmentType] : null,
                entry.workplaceType ? workplaceLabels[entry.workplaceType] : null,
                entry.location?.trim(),
              ].filter(Boolean)
              return (
                <article
                  className={[
                    styles.entry,
                    styles.experienceEntry,
                    start || end || entry.isCurrent || details.length > 0
                      ? styles.experienceWithMeta
                      : '',
                  ].filter(Boolean).join(' ')}
                  key={entry._id}
                >
                  <header className={styles.experienceIdentity}>
                    <div>
                      <h2 className={styles.title}>{entry.role?.trim()}</h2>
                      <p className={styles.organization}>{entry.organization?.trim()}</p>
                    </div>
                    {imagePresentation(entry.organizationLogo) && (
                      <div className={styles.logo}>
                        <ContentImage image={entry.organizationLogo} />
                      </div>
                    )}
                  </header>

                  {(start || end || entry.isCurrent || details.length > 0) && (
                    <div className={styles.experienceMeta}>
                      {(start || end || entry.isCurrent) && (
                        <p className={styles.meta}>
                          {start && <time dateTime={start.dateTime}>{start.label}</time>}
                          {start && (end || entry.isCurrent) && ' - '}
                          {entry.isCurrent ? 'Present' : end && (
                            <time dateTime={end.dateTime}>{end.label}</time>
                          )}
                        </p>
                      )}
                      {details.length > 0 && (
                        <ul className={styles.experienceFacts}>
                          {details.map((detail, index) => <li key={index}>{detail}</li>)}
                        </ul>
                      )}
                    </div>
                  )}

                  {(entry.description?.trim() || responsibilities.length > 0 ||
                    skills.length > 0 || href) && (
                    <div className={styles.experienceDetails}>
                      {entry.description?.trim() && (
                        <p className={styles.copy}>{entry.description.trim()}</p>
                      )}
                      {responsibilities.length > 0 && (
                        <ul className={styles.bullets}>
                          {responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                      )}
                      {skills.length > 0 && (
                        <ul className={styles.badges} aria-label="Technologies and skills">
                          {skills.map((skill) => (
                            <li key={skill._id}><SkillBadge name={skill.name!} /></li>
                          ))}
                        </ul>
                      )}
                      {href && <a className={styles.link} href={href}>Visit website<span aria-hidden="true" style={{marginInlineStart: '0.35em'}}>{'\u2197'}</span></a>}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
