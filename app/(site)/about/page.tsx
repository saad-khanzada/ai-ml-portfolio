import {getPageMetadata} from '@/lib/metadata'
import type {Metadata} from 'next'
import {getProfile, getSkills, getCertifications} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {getImageUrl} from '@/sanity/lib/image'
import {ProfileImage} from '@/components/ProfileImage'
import {ContentImage, imagePresentation} from '@/components/content/ContentImage'
import {RichText, hasRichText, safeContentUrl} from '@/components/content/RichText'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {SkillBadge} from '@/components/ui/SkillBadge'
import {EmptyState} from '@/components/ui/EmptyState'
import {CmsUnavailable} from '@/components/info/CmsUnavailable'
import {contentDate} from '@/lib/contentDate'
import styles from '@/components/info/Info.module.css'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    path: '/about',
    title: 'About',
    description: 'Professional background, skills, education and selected certifications.',
  })
}

function yearLabel(value: number | undefined) {
  return value !== undefined && Number.isInteger(value) &&
    value >= 1900 && value <= 2100 ? String(value) : null
}

export default async function AboutPage() {
  let profile: Awaited<ReturnType<typeof getProfile>>
  let skills: Awaited<ReturnType<typeof getSkills>>
  let certifications: Awaited<ReturnType<typeof getCertifications>>

  try {
    ;[profile, skills, certifications] = await Promise.all([
      getProfile(), getSkills(), getCertifications(),
    ])
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return <CmsUnavailable title="About" href="/about" />
  }

  const name = profile?.name?.trim()
  const headline = profile?.headline?.trim()
  const introduction = profile?.introduction?.trim()
  const location = profile?.location?.trim()
  const portrait = Boolean(
    (profile?.profileImage?.alt?.trim() || name) &&
    getImageUrl(profile?.profileImage, {width: 960, height: 1200}),
  )
  const resume = safeContentUrl(profile?.resume?.asset?.url)
  const education = (profile?.education ?? []).filter((entry) =>
    entry.qualification?.trim() && entry.institution?.trim(),
  )
  const groups = new Map<string, typeof skills>()
  for (const skill of skills) {
    if (!skill.name?.trim()) continue
    const category = skill.category?.trim() || 'Other skills'
    const group = groups.get(category) ?? []
    group.push(skill)
    groups.set(category, group)
  }
  const selectedCertifications = certifications.filter((entry) =>
    entry.featured && entry.title?.trim() && entry.provider?.trim(),
  )
  const hasIdentity = Boolean(name || headline || introduction || location || portrait || resume)

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <div className={styles.page}>
        <SectionHeading as="h1" title="About" />

        {hasIdentity && (
          <section
            className={[styles.intro, portrait ? styles.withPortrait : ''].join(' ')}
            aria-label="Professional profile"
          >
            <div className={styles.identity}>
              {name && <h2 className={styles.name}>{name}</h2>}
              {headline && <p className={styles.headline}>{headline}</p>}
              {introduction && <p className={styles.copy}>{introduction}</p>}
              {location && <p className={styles.meta}>{location}</p>}
              {resume && (
                <a className="site-button site-button-secondary" href={resume}>
                  View resume
                </a>
              )}
            </div>
            {portrait && (
              <div className={styles.portrait}>
                <ProfileImage
                  image={profile?.profileImage}
                  name={name}
                  sizes="(min-width: 768px) 256px, 224px"
                  preload
                />
              </div>
            )}
          </section>
        )}

        {hasRichText(profile?.bio) && (
          <section className={styles.section} aria-labelledby="about-background">
            <h2 id="about-background" className={styles.heading}>Background</h2>
            <div className={styles.prose}>
              <RichText value={profile?.bio} />
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className={styles.section} aria-labelledby="about-education">
            <h2 id="about-education" className={styles.heading}>Education</h2>
            <div className={styles.entries}>
              {education.map((entry) => {
                const start = yearLabel(entry.startYear)
                const end = yearLabel(entry.endYear)
                const dateText = entry.isCurrent
                  ? [start, 'Present'].filter(Boolean).join(' - ')
                  : [start, end].filter(Boolean).join(' - ')
                return (
                  <article className={styles.entry} key={entry._key}>
                    <h3 className={styles.title}>{entry.qualification?.trim()}</h3>
                    <p>{entry.institution?.trim()}</p>
                    {dateText && <p className={styles.meta}>{dateText}</p>}
                    {entry.isCurrent && end && (
                      <p className={styles.meta}>Expected completion: {end}</p>
                    )}
                    {entry.description?.trim() && (
                      <p className={styles.copy}>{entry.description.trim()}</p>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {groups.size > 0 && (
          <section className={styles.section} aria-labelledby="about-skills">
            <h2 id="about-skills" className={styles.heading}>Skills</h2>
            <div className={styles.groups}>
              {[...groups].map(([category, entries]) => (
                <div key={category}>
                  <h3 className={styles.title}>{category}</h3>
                  <ul className={styles.badges} aria-label={category}>
                    {entries.map((skill) => (
                      <li key={skill._id}><SkillBadge name={skill.name!} /></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedCertifications.length > 0 && (
          <section className={styles.section} aria-labelledby="about-certifications">
            <h2 id="about-certifications" className={styles.heading}>
              Selected certifications
            </h2>
            <div className={styles.entries}>
              {selectedCertifications.map((entry) => {
                const date = contentDate(entry.issueDate)
                const href = safeContentUrl(entry.credentialUrl)
                const topics = (entry.skills ?? []).filter((skill) => skill?.name?.trim())
                return (
                  <article className={styles.entry} key={entry._id}>
                    <h3 className={styles.title}>{entry.title?.trim()}</h3>
                    <p>{entry.provider?.trim()}</p>
                    {date && (
                      <time className={styles.meta} dateTime={date.dateTime}>{date.label}</time>
                    )}
                    {entry.credentialId?.trim() && (
                      <p className={styles.meta}>Credential ID: {entry.credentialId.trim()}</p>
                    )}
                    {topics.length > 0 && (
                      <ul className={styles.badges} aria-label="Certification topics">
                        {topics.map((skill) => (
                          <li key={skill._id}><SkillBadge name={skill.name!} /></li>
                        ))}
                      </ul>
                    )}
                    {imagePresentation(entry.certificateImage) && (
                      <div className={styles.certificateImage}>
                        <ContentImage image={entry.certificateImage} />
                      </div>
                    )}
                    {href && <a className={styles.link} href={href}>View credential</a>}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {!hasIdentity && !hasRichText(profile?.bio) && education.length === 0 &&
          groups.size === 0 && selectedCertifications.length === 0 && (
            <EmptyState title="Profile details are not published yet" />
          )}
      </div>
    </main>
  )
}
