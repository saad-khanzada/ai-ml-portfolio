import {getDetailMetadata} from '@/lib/metadata'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getBlogPostBySlug} from '@/sanity/lib/content'
import {CmsFetchError} from '@/sanity/lib/fetch'
import {contentDate} from '@/lib/contentDate'
import {ContentImage} from '@/components/content/ContentImage'
import {RichText, hasRichText} from '@/components/content/RichText'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {EmptyState} from '@/components/ui/EmptyState'
import styles from '../Blog.module.css'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps) {
  const {slug} = await params
  return getDetailMetadata('blog', slug)
}

export default async function ArticlePage({params}: PageProps) {
  const {slug} = await params
  let post: Awaited<ReturnType<typeof getBlogPostBySlug>>

  try {
    post = await getBlogPostBySlug(slug)
  } catch (error) {
    if (!(error instanceof CmsFetchError)) throw error
    return (
      <main id="main-content" tabIndex={-1} className="site-container site-section">
        <SectionHeading as="h1" title="Article temporarily unavailable" />
        <EmptyState
          title="The article could not be loaded"
          description="Please try again shortly."
        />
        <a
          className="site-button site-button-secondary"
          href={'/blog/' + encodeURIComponent(slug)}
        >
          Try again
        </a>
      </main>
    )
  }

  if (!post || !post.title?.trim()) notFound()

  const date = contentDate(post.publishedAt, true)
  const author = post.author?.name?.trim()
  const headline = post.author?.headline?.trim()
  const tags = [...new Set(
    (post.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
  )]
  const related = post.relatedProject
  const relatedSlug = related?.slug
  const showRelated = Boolean(
    related?.title?.trim() &&
    relatedSlug &&
    relatedSlug.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(relatedSlug),
  )

  return (
    <main id="main-content" tabIndex={-1} className="site-container site-section">
      <article className={styles.article}>
        <Link className={styles.back} href="/blog">Back to blog</Link>

        <header className={styles.header}>
          {tags.length > 0 && (
            <ul className={styles.tags} aria-label="Article tags">
              {tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          <h1 className={styles.title}>{post.title.trim()}</h1>
          {post.excerpt?.trim() && (
            <p className={styles.dek}>{post.excerpt.trim()}</p>
          )}
          {(date || author) && (
            <div className={styles.meta}>
              {author && <span className={styles.authorName}>{author}</span>}
              {date && <time dateTime={date.dateTime}>{date.label}</time>}
            </div>
          )}
          {author && headline && (
            <p className={styles.authorHeadline}>{headline}</p>
          )}
        </header>

        <ContentImage image={post.coverImage} variant="cover" preload />

        {hasRichText(post.body) && (
          <div className={styles.body}>
            <RichText value={post.body} />
          </div>
        )}

        {showRelated && related && (
          <aside className={styles.related} aria-labelledby="related-project-heading">
            <h2 id="related-project-heading">Related project</h2>
            <h3>
              <Link href={'/projects/' + relatedSlug}>
                {related.title?.trim()}
              </Link>
            </h3>
            {related.summary?.trim() && (
              <p className="site-copy">{related.summary.trim()}</p>
            )}
          </aside>
        )}
      </article>
    </main>
  )
}
