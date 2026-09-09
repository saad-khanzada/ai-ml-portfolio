import {defineArrayMember, defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Profile / Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter your name.' : true
      ),
    }),
    defineField({
      name: 'headline',
      title: 'Professional headline',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a headline.' : true
      ),
    }),
    defineField({
      name: 'introduction',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'bio',
      title: 'Longer bio',
      type: 'richText',
      description: 'A concise professional introduction, direction, and interests.',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile image',
      type: 'contentImage',
    }),
    defineField({
      name: 'email',
      title: 'Public contact email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'resume',
      title: 'Resume / CV',
      type: 'file',
      options: {accept: '.pdf'},
      description: 'Upload a public PDF resume. Replace it here when updated.',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        const asset = (value as {asset?: {_ref?: string}}).asset?._ref
        return !asset || asset.endsWith('-pdf')
          ? true
          : 'Upload a PDF resume.'
      }),
    }),
    ...[
      {name: 'githubUrl', title: 'GitHub URL'},
      {name: 'linkedinUrl', title: 'LinkedIn URL'},
      {name: 'huggingFaceUrl', title: 'Hugging Face URL'},
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
      name: 'additionalSocialLinks',
      title: 'Additional social links',
      type: 'array',
      of: [defineArrayMember({
        name: 'socialLink',
        title: 'Social link',
        type: 'object',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (Rule) => Rule.required().custom((value) =>
              value !== undefined && !value.trim() ? 'Enter a label.' : true
            ),
          }),
          defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required().uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      })],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [defineArrayMember({
        name: 'educationEntry',
        title: 'Education entry',
        type: 'object',
        fields: [
          defineField({
            name: 'qualification',
            title: 'Degree / qualification',
            type: 'string',
            validation: (Rule) => Rule.required().custom((value) =>
              value !== undefined && !value.trim() ? 'Enter a qualification.' : true
            ),
          }),
          defineField({
            name: 'institution',
            title: 'Institution',
            type: 'string',
            validation: (Rule) => Rule.required().custom((value) =>
              value !== undefined && !value.trim() ? 'Enter an institution.' : true
            ),
          }),
          defineField({
            name: 'startYear',
            title: 'Start year',
            type: 'number',
            validation: (Rule) => Rule.integer().min(1900).max(2100),
          }),
          defineField({
            name: 'endYear',
            title: 'Completion / expected completion year',
            type: 'number',
            validation: (Rule) => Rule.integer().min(1900).max(2100)
              .custom((value, context) => {
                const parent = context.parent as {startYear?: number} | undefined
                return value !== undefined && parent?.startYear !== undefined &&
                  value < parent.startYear
                  ? 'Completion year cannot be before start year.'
                  : true
              }),
          }),
          defineField({
            name: 'isCurrent',
            title: 'Currently studying',
            type: 'boolean',
            initialValue: false,
          }),
          defineField({
            name: 'description',
            title: 'Short description',
            type: 'text',
            rows: 2,
          }),
        ],
        preview: {select: {title: 'qualification', subtitle: 'institution'}},
      })],
    }),
    defineField({
      name: 'projectsCtaText',
      title: 'Homepage projects button text',
      type: 'string',
      description: 'Optional. The button destination is controlled in code.',
    }),
    defineField({
      name: 'resumeCtaText',
      title: 'Homepage resume button text',
      type: 'string',
    }),
    defineField({
      name: 'contactCtaHeading',
      title: 'Contact call-to-action heading',
      type: 'string',
    }),
    defineField({
      name: 'contactCtaText',
      title: 'Contact call-to-action message',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'string',
    }),
    defineField({
      name: 'footerText',
      title: 'Additional footer text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Default SEO title',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Aim for 60 characters or fewer.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Aim for 160 characters or fewer.'),
    }),
    defineField({
      name: 'socialImage',
      title: 'Default social sharing image',
      type: 'contentImage',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'headline', media: 'profileImage'},
  },
})
