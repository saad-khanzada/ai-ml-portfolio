import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a title.' : true
      ),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter an excerpt.' : true
      ),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required().custom((value) =>
        !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
          ? true
          : 'Use lowercase letters, numbers, and single hyphens.'
      ),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'contentImage',
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'richText',
      validation: (Rule) => Rule.required().min(1).custom((value) => {
        if (!value) return true

        if (!Array.isArray(value)) return 'Article content must be a rich-text array.'

        const hasContent = value.some((item: unknown) => {
          if (!item || typeof item !== 'object') return false
          const block = item as {
            _type?: string
            children?: {text?: string}[]
            asset?: {_ref?: string}
            code?: string
          }

          if (block._type === 'block') {
            return block.children?.some((child) => child.text?.trim())
          }

          if (block._type === 'contentImage') {
            return Boolean(block.asset?._ref)
          }

          if (block._type === 'codeBlock') {
            return Boolean(block.code?.trim())
          }

          return false
        })

        return hasContent ? true : 'Add article content before publishing.'
      }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      description: 'Displayed article date. This field does not schedule publishing.',
      validation: (Rule) => Rule.required().custom((value) =>
        !value || !Number.isNaN(Date.parse(value))
          ? true
          : 'Enter a valid publication date and time.'
      ),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'profile'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      options: {layout: 'tags'},
      of: [defineArrayMember({
        type: 'string',
        validation: (Rule) => Rule.required().custom((value) =>
          value !== undefined && !value.trim() ? 'Enter a tag.' : true
        ),
      })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured article',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Aim for 60 characters or fewer.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Aim for 160 characters or fewer.'),
    }),
  ],
  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.name',
      media: 'coverImage',
    },
  },
})
