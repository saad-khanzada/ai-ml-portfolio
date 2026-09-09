import type {ReactNode} from 'react'
import {Navbar} from '@/components/Navbar'
import {Footer} from '@/components/Footer'
import {getProfile} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'

function safeResumeUrl(value?: string | null): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  let profile: Awaited<ReturnType<typeof getProfile>> = null

  try {
    profile = await getProfile()
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    console.error('[CMS] Site profile unavailable; rendering the fallback shell.')
  }

  const name = profile?.name?.trim() || 'AI/ML Portfolio'
  const resumeUrl = safeResumeUrl(profile?.resume?.asset?.url)

  return (
    <div className="site-shell">
      <a className="site-skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar name={name} resumeUrl={resumeUrl} />
      <div className="site-content">{children}</div>
      <Footer
        name={name}
        year={new Date().getUTCFullYear()}
        tagline={profile?.footerTagline}
        text={profile?.footerText}
        githubUrl={profile?.githubUrl}
        linkedinUrl={profile?.linkedinUrl}
        email={profile?.email}
      />
    </div>
  )
}
