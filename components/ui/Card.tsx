import type {ComponentPropsWithoutRef} from 'react'

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      {...props}
      className={['site-card', className].filter(Boolean).join(' ')}
    />
  )
}
