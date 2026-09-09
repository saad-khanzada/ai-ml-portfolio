type SkillBadgeProps = {
  name: string
}

export function SkillBadge({name}: SkillBadgeProps) {
  const label = name.trim()
  if (!label) return null

  return <span className="site-badge">{label}</span>
}
