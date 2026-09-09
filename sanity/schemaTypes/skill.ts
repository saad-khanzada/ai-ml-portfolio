import {defineField, defineType} from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill name',
      type: 'string',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a skill name.' : true
      ),
    }),
    defineField({
      name: 'category',
      title: 'Skill category',
      type: 'string',
      description: 'A content grouping, such as Languages or Tools.',
      validation: (Rule) => Rule.required().custom((value) =>
        value !== undefined && !value.trim() ? 'Enter a category.' : true
      ),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Optional image displayed alongside the skill name.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Optional when the icon repeats the adjacent skill name.',
        }),
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Core / featured skill',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'level',
      title: 'Qualitative level',
      type: 'string',
      description: 'Optional. Use an honest descriptive level, never a percentage.',
      options: {
        list: [
          {title: 'Foundational', value: 'foundational'},
          {title: 'Working knowledge', value: 'working-knowledge'},
          {title: 'Proficient', value: 'proficient'},
          {title: 'Advanced', value: 'advanced'},
        ],
      },
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'category', media: 'icon'}},
})
