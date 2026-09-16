import {defineField, defineType} from 'sanity'

export const contentImage = defineType({
  name: 'contentImage',
  title: 'Content image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'displaySize',
      title: 'Screenshot display size',
      type: 'string',
      description: 'Applies to Project section/gallery images and Blog body images. Empty means Auto. Resizes your saved Sanity composition without additional cropping. Cover images and other pages keep their existing treatment.',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: 'Compact', value: 'compact'},
          {title: 'Standard', value: 'standard'},
          {title: 'Wide', value: 'wide'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.custom((value) =>
        value === undefined || ['auto', 'compact', 'standard', 'wide'].includes(value)
          ? true
          : 'Choose one of the listed screenshot sizes.',
      ),
    }),
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
