import {defineArrayMember, defineField, defineType} from 'sanity'

export const certification = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Certification title',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a title.' : true
      ),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a provider.' : true
      ),
    }),
    defineField({
      name: 'issueDate',
      title: 'Issue date',
      type: 'date',
      validation: (Rule) => Rule.required().custom((value) => {
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
      name: 'credentialId',
      title: 'Credential ID',
      type: 'string',
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
      }),
    }),
    defineField({
      name: 'certificateImage',
      title: 'Certificate image',
      type: 'contentImage',
    }),
    defineField({
      name: 'skills',
      title: 'Skills / topics',
      type: 'array',
      description: 'Reference the relevant skill records.',
      of: [defineArrayMember({
        type: 'reference',
        to: [{type: 'skill'}],
      })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured certification',
      type: 'boolean',
      description: 'Select only certifications worth highlighting on the portfolio.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Issue date, newest first',
      name: 'issueDateDesc',
      by: [{field: 'issueDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'provider',
      media: 'certificateImage',
    },
  },
})
