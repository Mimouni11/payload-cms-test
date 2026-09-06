import type { CollectionConfig } from 'payload'

import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * The company's services — what the homepage calls "Nos métiers".
 *
 * A collection rather than rows inside the Expertises global, because projects
 * tag themselves with these. Kept as an array they would be duplicated as free
 * text on every project and drift the moment someone typed "Signalitique".
 *
 * The Expertises global still owns the section's chrome (label, heading); this
 * owns the entries.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Métier',
    plural: 'Métiers',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description: 'Shown in the "Nos métiers" section, and used to tag projects.',
  },
  lockDocuments: false,
  hooks: {
    afterChange: [revalidateHomeCollection],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
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
      admin: { description: 'Shown when the accordion row is open. Optional.' },
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
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sort order',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the accordion.',
      },
    },
  ],
}
