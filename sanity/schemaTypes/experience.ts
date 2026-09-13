import {defineArrayMember, defineField, defineType} from 'sanity'

function validDate(value: string | undefined) {
  if (!value) return true
  const date = new Date(value)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? true
    : 'Enter a valid calendar date.'
}

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a role.' : true
      ),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter an organization.' : true
      ),
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Show on homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Select relevant roles for the homepage. At most two selected roles appear, in the existing experience order.',
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {
        list: [
          {title: 'Full-time', value: 'full-time'},
          {title: 'Part-time', value: 'part-time'},
          {title: 'Internship', value: 'internship'},
          {title: 'Contract', value: 'contract'},
          {title: 'Freelance', value: 'freelance'},
          {title: 'Self-employed', value: 'self-employed'},
          {title: 'Volunteer', value: 'volunteer'},
        ],
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      validation: (Rule) => Rule.required().custom(validDate),
    }),
    defineField({
      name: 'isCurrent',
      title: 'I currently work in this role',
      type: 'boolean',
      initialValue: false,
      description: 'Displays Present instead of an end date.',
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      description: 'Optional. Clear this date before marking the role as current.',
      validation: (Rule) => Rule.custom((value, context) => {
        const result = validDate(value)
        if (result !== true) return result
        if (!value) return true
        if (context.document?.isCurrent) {
          return 'Clear the end date for a current role.'
        }
        const start = context.document?.startDate
        return typeof start === 'string' && value < start
          ? 'End date cannot be before start date.'
          : true
      }),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Optional city, region, or country.',
    }),
    defineField({
      name: 'workplaceType',
      title: 'Workplace type',
      type: 'string',
      options: {
        list: [
          {title: 'Remote', value: 'remote'},
          {title: 'Hybrid', value: 'hybrid'},
          {title: 'On-site', value: 'on-site'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities and achievements',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().custom((value) =>
            value !== undefined && !value.trim()
              ? 'Enter a responsibility or remove this item.'
              : true
          ),
        }),
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Technologies / skills',
      type: 'array',
      of: [defineArrayMember({
        type: 'reference',
        to: [{type: 'skill'}],
      })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'organizationLogo',
      title: 'Organization logo',
      type: 'contentImage',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External link',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
      }),
    }),
  ],
  orderings: [
    {
      title: 'Start date, newest first',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'organization',
      media: 'organizationLogo',
    },
  },
})
