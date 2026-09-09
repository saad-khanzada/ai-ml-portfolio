import type {SKILLS_QUERY_RESULT} from '@/types/sanity.generated'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {SkillBadge} from '@/components/ui/SkillBadge'
import styles from './SkillsSection.module.css'

export function SkillsSection({skills}: {skills: SKILLS_QUERY_RESULT}) {
  const groups = new Map<string, Array<{id: string; name: string}>>()

  for (const skill of skills) {
    const name = skill.name?.trim()
    if (!skill.featured || !name) continue

    const category = skill.category?.trim() || ''
    const group = groups.get(category) ?? []
    group.push({id: skill._id, name})
    groups.set(category, group)
  }

  if (groups.size === 0) return null

  return (
    <section
      aria-labelledby="skills-heading"
      className="site-container site-section"
    >
      <SectionHeading id="skills-heading" title="Skills" />
      <div className={styles.groups}>
        {Array.from(groups, ([category, items]) => (
          <div key={category} className={styles.group}>
            {category && <h3 className={styles.title}>{category}</h3>}
            <ul className={styles.list}>
              {items.map((skill) => (
                <li key={skill.id}>
                  <SkillBadge name={skill.name} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
