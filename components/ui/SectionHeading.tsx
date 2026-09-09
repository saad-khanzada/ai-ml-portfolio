type SectionHeadingProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div className="site-section-heading">
      {eyebrow?.trim() && <p className="site-label">{eyebrow}</p>}
      <Heading
        id={id}
        className={'site-heading ' + (
          Heading === 'h1' ? 'site-heading-lg' : 'site-heading-md'
        )}
      >
        {title}
      </Heading>
      {description?.trim() && <p className="site-copy">{description}</p>}
    </div>
  )
}
