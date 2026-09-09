import {defineField, defineType} from 'sanity'

export const contentImage = defineType({
  name: 'contentImage',
  title: 'Content image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for someone who cannot see it.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  validation: (Rule) => Rule.custom((value) => {
    if (!value) return true
    const image = value as {asset?: {_ref?: string}; alt?: string; caption?: string}
    if (!image.asset?._ref) {
      return image.alt || image.caption ? 'Select an image or clear this field.' : true
    }
    return image.alt?.trim() ? true : 'Add alternative text for this image.'
  }),
})
