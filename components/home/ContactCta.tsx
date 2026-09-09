import type {PROFILE_QUERY_RESULT} from '@/types/sanity.generated'
import {SectionHeading} from '@/components/ui/SectionHeading'
import styles from './HomeSections.module.css'

function safeWebUrl(value?: string | null): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : null
  } catch {
    return null
  }
}

export function ContactCta({profile}: {profile: PROFILE_QUERY_RESULT}) {
  const email = profile?.email?.trim()
  const emailHref = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? 'mailto:' + encodeURIComponent(email)
    : null
  const linkedin = safeWebUrl(profile?.linkedinUrl)

  if (!emailHref && !linkedin) return null

  return (
    <section
      aria-labelledby="contact-heading"
      className="site-container site-section"
    >
      <div className={styles.contact}>
        <SectionHeading
          id="contact-heading"
          title={profile?.contactCtaHeading?.trim() || 'Get in touch'}
          description={profile?.contactCtaText?.trim() || undefined}
        />
        <div className={styles.actions}>
          {emailHref && (
            <a className="site-button site-button-primary" href={emailHref}>
              Email me
            </a>
          )}
          {linkedin && (
            <a className="site-button site-button-secondary" href={linkedin}>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
