import {getPageMetadata} from '@/lib/metadata'
import type {Metadata} from 'next'
import {getProfile} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {safeContentUrl} from '@/components/content/RichText'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import {CmsUnavailable} from '@/components/info/CmsUnavailable'
import styles from '@/components/info/Info.module.css'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    path: '/contact',
    title: 'Contact',
    description: 'Published contact details and professional profiles.',
  })
}

export default async function ContactPage() {
  let profile: Awaited<ReturnType<typeof getProfile>>
  try {
    profile = await getProfile()
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return <CmsUnavailable title="Contact" href="/contact" />
  }

  const email = profile?.email?.trim()
  const emailHref = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? 'mailto:' + encodeURIComponent(email)
    : null
  const candidates = [
    {key: 'linkedin', label: 'LinkedIn', value: profile?.linkedinUrl},
    {key: 'github', label: 'GitHub', value: profile?.githubUrl},
    {key: 'huggingface', label: 'Hugging Face', value: profile?.huggingFaceUrl},
    ...(profile?.additionalSocialLinks ?? []).map((link) => ({
      key: 'additional-' + link._key,
      label: link.label?.trim(),
      value: link.url,
    })),
  ]
  const links = candidates.map((link) => ({
    ...link, href: safeContentUrl(link.value),
  })).filter((link) => link.label && link.href)
  const hasContact = Boolean(emailHref || links.length > 0)

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <div className={styles.page}>
        <SectionHeading as="h1" title="Contact" />
        {hasContact ? (
          <div className={styles.contactEditorial}>
            {profile?.contactCtaText?.trim() && (
              <p className={styles.contactIntroduction}>
                {profile.contactCtaText.trim()}
              </p>
            )}
            <div className={[
              styles.contactMethods,
              emailHref && links.length > 0 ? styles.contactTwoColumns : '',
            ].filter(Boolean).join(' ')}>
              {emailHref && (
                <section aria-labelledby="contact-email">
                  <h2 id="contact-email" className={styles.contactLabel}>Email</h2>
                  <a className={styles.contactEmail} href={emailHref}>{email}</a>
                </section>
              )}
              {links.length > 0 && (
                <section aria-labelledby="contact-profiles">
                  <h2 id="contact-profiles" className={styles.contactLabel}>
                    Professional profiles
                  </h2>
                  <ul className={styles.contactProfiles}>
                    {links.map((link) => (
                      <li key={link.key}>
                        <a className={styles.link} href={link.href!}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            {profile?.location?.trim() && (
              <p className={styles.meta}>{profile.location.trim()}</p>
            )}
          </div>
        ) : (
          <EmptyState title="Contact details are not published yet" />
        )}
      </div>
    </main>
  )
}
