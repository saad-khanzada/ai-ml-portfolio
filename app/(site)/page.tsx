import {getPageMetadata} from '@/lib/metadata'
import {Hero} from '@/components/home/Hero'
import {getProfile, getProjects, getSkills, getExperience, getBlogPosts} from '@/sanity/lib/content'
import {ExperienceSnapshot} from '@/components/home/ExperienceSnapshot'
import {RecentPosts} from '@/components/home/RecentPosts'
import {ContactCta} from '@/components/home/ContactCta'
import {SkillsSection} from '@/components/home/SkillsSection'
import {FeaturedProjects, selectFeaturedProjects} from '@/components/home/FeaturedProjects'
import {CmsFetchError} from '@/sanity/lib/fetch'

export async function generateMetadata() {
  return getPageMetadata({path: '/'})
}

export default async function Home() {
  let profile: Awaited<ReturnType<typeof getProfile>>
  let projects: Awaited<ReturnType<typeof getProjects>>
  let skills: Awaited<ReturnType<typeof getSkills>>
  let experience: Awaited<ReturnType<typeof getExperience>>
  let posts: Awaited<ReturnType<typeof getBlogPosts>>

  try {
    ;[profile, projects, skills, experience, posts] = await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getExperience(),
      getBlogPosts(),
    ])
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error

    return (
      <main id="main-content" tabIndex={-1}>
        <section className="site-container site-section">
          <h1 className="site-heading site-heading-lg">AI/ML Portfolio</h1>
          <p className="site-copy">
            Content is temporarily unavailable. Please try again shortly.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <Hero
        profile={profile}
        showProjectsLink={selectFeaturedProjects(projects).length > 0}
      />
      <FeaturedProjects projects={projects} />
      <SkillsSection skills={skills} />
      <ExperienceSnapshot experience={experience} />
      <RecentPosts posts={posts} />
      <ContactCta profile={profile} />
    </main>
  )
}
