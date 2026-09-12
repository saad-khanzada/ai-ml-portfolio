import Link from 'next/link'
import {SectionHeading} from '@/components/ui/SectionHeading'

export default function ProjectNotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <SectionHeading
        as="h1"
        title="Project not found"
        description="This project may have been removed or is not yet published."
      />
      <Link className="site-button site-button-secondary" href="/projects">
        Back to projects
      </Link>
    </main>
  )
}
