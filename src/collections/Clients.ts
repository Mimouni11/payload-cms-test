import type { CollectionConfig } from 'payload'

import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/**
 * Client logos for the marquee strip under the hero.
 *
 * A collection because this is the content that changes most often on the page —
 * winning clients is the business. It was five entries hardcoded in
 * `ClientLogos/placeholder.ts` pointing at files uploaded to R2 by hand, so
 * adding one meant a developer, a commit and a deploy.
 */
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description: 'Logos in the band under the hero.',
  },
  lockDocuments: false,
  hooks: {
    afterChange: [revalidateHomeCollection],
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
      admin: {
        placeholder: 'Inetum',
        description: 'Used as the logo’s alt text.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description:
          'The row scales every logo to the same height, so upload it trimmed to its own edges — extra padding makes it look smaller than its neighbours. Transparent PNG or SVG.',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Site web',
      admin: {
        placeholder: 'https://…',
        description: 'Optional. Makes the logo a link.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sort order',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
