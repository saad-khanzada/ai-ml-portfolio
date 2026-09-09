type FooterProps = {
  name: string
  year: number
  tagline?: string | null
  text?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  email?: string | null
}

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

export function Footer({
  name,
  year,
  tagline,
  text,
  githubUrl,
  linkedinUrl,
  email,
}: FooterProps) {
  const github = safeWebUrl(githubUrl)
  const linkedin = safeWebUrl(linkedinUrl)
  const address = email?.trim()
  const emailHref = address && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
    ? 'mailto:' + encodeURIComponent(address)
    : null
  const hasLinks = Boolean(github || linkedin || emailHref)

  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <div className="site-footer-identity">
          <p className="site-footer-name">{name}</p>
          {tagline?.trim() && <p className="site-copy">{tagline}</p>}
          {text?.trim() && <p className="site-copy">{text}</p>}
        </div>

        {hasLinks && (
          <nav aria-label="Footer links">
            <ul>
              {github && <li><a href={github}>GitHub</a></li>}
              {linkedin && <li><a href={linkedin}>LinkedIn</a></li>}
              {emailHref && <li><a href={emailHref}>Email</a></li>}
            </ul>
          </nav>
        )}

        <p className="site-copyright">
          {'\u00A9'} {year} {name}
        </p>
      </div>
    </footer>
  )
}
