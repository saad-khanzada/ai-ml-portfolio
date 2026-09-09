import type {PROFILE_QUERY_RESULT} from '@/types/sanity.generated'
import {ProfileImage} from '@/components/ProfileImage'
import {ButtonLink} from '@/components/ui/Button'
import {getImageUrl} from '@/sanity/lib/image'
import styles from './Hero.module.css'

type HeroProps = {
  profile: PROFILE_QUERY_RESULT
  showProjectsLink?: boolean
}

function getResumeUrl(value?: string | null): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export function Hero({profile, showProjectsLink = false}: HeroProps) {
  const name = profile?.name?.trim() || 'AI/ML Portfolio'
  const headline = profile?.headline?.trim()
  const introduction = profile?.introduction?.trim()
  const location = profile?.location?.trim()
  const resumeUrl = getResumeUrl(profile?.resume?.asset?.url)
  const hasPortrait = Boolean(
    getImageUrl(profile?.profileImage, {width: 960, height: 1200}),
  )

  return (
    <section
      aria-labelledby="hero-heading"
      className={'site-container site-section ' + styles.hero +
        (hasPortrait ? ' ' + styles.withPortrait : '')}
    >
      <div className={styles.content}>
        <h1 id="hero-heading" className="site-heading site-heading-lg">
          {name}
        </h1>
        {headline && <p className={styles.headline}>{headline}</p>}
        {introduction && (
          <p className={'site-copy ' + styles.introduction}>{introduction}</p>
        )}
        {location && <p className={styles.location}>{location}</p>}

        {(showProjectsLink || resumeUrl) && (
          <div className={styles.actions}>
            {showProjectsLink && (
              <ButtonLink href="#featured-projects">
                {profile?.projectsCtaText?.trim() || 'View projects'}
              </ButtonLink>
            )}
            {resumeUrl && (
              <ButtonLink href={resumeUrl} variant="secondary">
                {profile?.resumeCtaText?.trim() || 'View resume'}
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      {hasPortrait && (
        <div className={styles.portrait}>
          <ProfileImage
            image={profile?.profileImage}
            name={name}
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, (max-width: 264px) calc(100vw - 40px), 224px"
            preload
          />
        </div>
      )}
    </section>
  )
}
