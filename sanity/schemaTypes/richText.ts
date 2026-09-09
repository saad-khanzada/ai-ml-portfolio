import {defineArrayMember, defineField, defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Inline code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) => Rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                  allowRelative: false,
                }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({type: 'contentImage'}),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code block',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          description: 'Optional language identifier, such as python or typescript.',
        }),
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 12,
          validation: (Rule) => Rule.required().custom((value) =>
            value !== undefined && !value.trim() ? 'Enter code.' : true
          ),
        }),
      ],
      preview: {
        select: {filename: 'filename', language: 'language'},
        prepare({filename, language}) {
          return {
            title: filename || 'Code block',
            subtitle: language || 'Plain text',
          }
        },
      },
    }),
  ],
})
