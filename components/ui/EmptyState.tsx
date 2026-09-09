type EmptyStateProps = {
  title: string
  description?: string
  headingLevel?: 'h2' | 'h3'
}

export function EmptyState({
  title,
  description,
  headingLevel: Heading = 'h2',
}: EmptyStateProps) {
  return (
    <div className="site-empty-state">
      <Heading>{title}</Heading>
      {description?.trim() && <p className="site-copy">{description}</p>}
    </div>
  )
}
