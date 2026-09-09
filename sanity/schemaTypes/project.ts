import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a summary.' : true
      ),
    }),
    defineField({
      name: 'primaryCategory',
      title: 'Primary category',
      type: 'reference',
      to: [{type: 'projectCategory'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      description: 'Select skills or create new skill records as needed.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'skill'}]})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Optional. Required to make an individual case-study URL available.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        return value.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
          ? true
          : 'Generate a slug, or clear this optional field.'
      }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'contentImage',
    }),
    defineField({
      name: 'projectDate',
      title: 'Project date',
      type: 'date',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        const date = new Date(value)
        return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value
          ? true
          : 'Enter a valid calendar date.'
      }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured project',
      type: 'boolean',
      initialValue: false,
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
    defineField({name: 'problem', title: 'Problem', type: 'richText'}),
    defineField({name: 'objective', title: 'Objective', type: 'richText'}),
    defineField({name: 'approach', title: 'Approach', type: 'richText'}),
    defineField({
      name: 'content',
      title: 'Implementation / full case study',
      type: 'richText',
      description: 'Use headings to describe the process appropriate to this project.',
    }),
    defineField({name: 'results', title: 'Results', type: 'richText'}),
    defineField({
      name: 'metrics',
      title: 'Result metrics',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'metric',
          title: 'Metric',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Metric name',
              type: 'string',
              validation: (Rule) => Rule.required().custom((value) =>
                value !== undefined && !value.trim() ? 'Enter a metric name.' : true
              ),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'Include units where appropriate.',
              validation: (Rule) => Rule.required().custom((value) =>
                value !== undefined && !value.trim() ? 'Enter a value.' : true
              ),
            }),
            defineField({
              name: 'context',
              title: 'Evaluation context',
              type: 'text',
              rows: 2,
              description: 'Optional dataset, baseline, or measurement conditions.',
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshot gallery',
      type: 'array',
      of: [defineArrayMember({
        type: 'contentImage',
        validation: (Rule) => Rule.custom((value) => {
          const image = value as {
            asset?: {_ref?: string}
            alt?: string
          } | undefined
          if (!image?.asset?._ref) {
            return 'Select a screenshot or remove this gallery item.'
          }
          return image.alt?.trim()
            ? true
            : 'Add alternative text for this screenshot.'
        }),
      })],
    }),
    defineField({name: 'challenges', title: 'Challenges', type: 'richText'}),
    defineField({name: 'whatILearned', title: 'What I learned', type: 'richText'}),
    ...[
      {name: 'githubUrl', title: 'GitHub URL'},
      {name: 'liveDemoUrl', title: 'Live demo URL'},
      {name: 'huggingFaceUrl', title: 'Hugging Face URL'},
      {name: 'notebookUrl', title: 'Notebook URL'},
      {name: 'datasetUrl', title: 'Dataset URL'},
      {name: 'videoUrl', title: 'Video / demo URL'},
    ].map(({name, title}) => defineField({
      name,
      title,
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
      }),
    })),
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'primaryCategory.title',
      media: 'coverImage',
    },
  },
})
