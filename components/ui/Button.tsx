import Link from 'next/link'
import type {ComponentPropsWithoutRef} from 'react'

type Variant = 'primary' | 'secondary'

type SharedProps = {
  variant?: Variant
  className?: string
}

type ButtonProps = SharedProps & ComponentPropsWithoutRef<'button'>
type ButtonLinkProps = SharedProps & ComponentPropsWithoutRef<typeof Link>

function classes(variant: Variant, className?: string) {
  return ['site-button', 'site-button-' + variant, className]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return <button {...props} type={type} className={classes(variant, className)} />
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={classes(variant, className)} />
}
