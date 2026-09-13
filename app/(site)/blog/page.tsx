import type {Metadata} from 'next'
import {getBlogPosts} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {RecentPosts} from '@/components/home/RecentPosts'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import styles from './Blog.module.css'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles on AI, machine learning and practical development.',
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>

  try {
    posts = await getBlogPosts()
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return (
      <main id="main-content" tabIndex={-1} className="site-container site-section">
        <SectionHeading as="h1" title="Blog" />
        <EmptyState
          title="Articles are temporarily unavailable"
          description="Please try again shortly."
        />
        {/* A full-page reload retries the CMS request. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="site-button site-button-secondary" href="/blog">
          Try again
        </a>
      </main>
    )
  }

  const visible = posts.filter((post) =>
    post.title?.trim() &&
    post.slug &&
    post.slug.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug),
  )

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <SectionHeading as="h1" title="Blog" />
      <div className={styles.listing}>
        {visible.length > 0 ? (
          <RecentPosts posts={visible} limit={visible.length} contained />
        ) : (
          <EmptyState
            title="No articles published yet"
            description="Technical articles will appear here when published."
          />
        )}
      </div>
    </main>
  )
}
