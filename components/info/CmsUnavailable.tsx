import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'

export function CmsUnavailable({title, href}: {title: string; href: string}) {
  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <SectionHeading as="h1" title={title} />
      <EmptyState
        title="Content is temporarily unavailable"
        description="Please try again shortly."
      />
      <a className="site-button site-button-secondary" href={href}>
        Try again
      </a>
    </main>
  )
}
