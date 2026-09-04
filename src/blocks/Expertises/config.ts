import type { GlobalConfig } from 'payload'

/**
 * Editable source for the expertises section.
 *
 * A global rather than a collection: there is exactly one of these on the
 * homepage, with fixed slots. Each row in `items` is one accordion entry and
 * one carousel slide — adding a row adds both.
 */
export const ExpertisesGlobal: GlobalConfig = {
  slug: 'expertises',
  label: 'Nos métiers',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }`,
    },
  },
  versions: {
    drafts: { autosave: { interval: 200 }, schedulePublish: true },
    max: 30,
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Label',
      defaultValue: 'Nos métiers',
    },
    {
      name: 'headingLines',
      type: 'array',
      label: 'Heading',
      maxRows: 3,
      labels: { singular: 'Line', plural: 'Lines' },
      admin: { description: 'One row per line. The break is deliberate, not reflowed.' },
      defaultValue: [{ text: 'Six expertises.' }, { text: 'Une seule équipe.' }],
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Expertises',
      minRows: 1,
      maxRows: 10,
      labels: { singular: 'Expertise', plural: 'Expertises' },
      admin: {
        description: 'Drag to reorder. Each row is one accordion entry and one carousel slide.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { placeholder: 'Cloisonnement' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Body copy',
          admin: { description: 'Shown when the row is open. Optional.' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Carousel photo',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Photo caption',
          admin: { description: 'Overlaid on the photo, bottom left. Optional.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkLabel',
              type: 'text',
              label: 'Link label',
              defaultValue: 'Découvrir',
              admin: { width: '50%' },
            },
            {
              name: 'linkHref',
              type: 'text',
              label: 'Link URL',
              defaultValue: '#',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
