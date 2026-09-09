import Image from 'next/image'
import Link from 'next/link'
import type {BLOG_POSTS_QUERY_RESULT} from '@/types/sanity.generated'
import {Card} from '@/components/ui/Card'
import {SectionHeading} from '@/components/ui/SectionHeading'
import {getImageUrl} from '@/sanity/lib/image'
import {contentDate} from '@/lib/contentDate'
import styles from './HomeSections.module.css'

export function RecentPosts({
  posts,
  enableDetailLinks = false,
}: {
  posts: BLOG_POSTS_QUERY_RESULT
  enableDetailLinks?: boolean
}) {
  const recent = posts.filter((post) =>
    post.title?.trim() &&
    post.slug &&
    post.slug.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug),
  ).slice(0, 3)

  if (recent.length === 0) return null

  return (
    <section
      aria-labelledby="recent-posts-heading"
      className="site-container site-section"
    >
      <SectionHeading id="recent-posts-heading" title="Recent writing" />
      <div className={styles.blogGrid}>
        {recent.map((post) => {
          const date = contentDate(post.publishedAt)
          const author = post.author?.name?.trim()
          const excerpt = post.excerpt?.trim()
          const alt = post.coverImage?.alt?.trim()
          const imageUrl = alt
            ? getImageUrl(post.coverImage, {width: 1200, height: 750})
            : null

          return (
            <Card key={post._id} className={styles.blogCard}>
              {imageUrl && alt && (
                <Image
                  className={styles.blogImage}
                  src={imageUrl}
                  alt={alt}
                  width={1200}
                  height={750}
                  sizes="(min-width: 1200px) 400px, (min-width: 768px) 50vw, 100vw"
                />
              )}
              <h3 className={styles.title}>
                {enableDetailLinks ? (
                  <Link href={'/blog/' + post.slug}>{post.title?.trim()}</Link>
                ) : post.title?.trim()}
              </h3>
              {(date || author) && (
                <div className={styles.meta}>
                  {date && <time dateTime={date.dateTime}>{date.label}</time>}
                  {author && <span>{author}</span>}
                </div>
              )}
              {excerpt && (
                <p className={'site-copy ' + styles.description}>{excerpt}</p>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
