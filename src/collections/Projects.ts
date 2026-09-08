import type { CollectionConfig } from 'payload'

import { PROJECT_CATEGORIES } from '@/blocks/Projects/categories'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/** "EY Ernst & Young" → "ey-ernst-young" */
const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Delivered projects — "Nos réalisations".
 *
 * A collection because there are many, they are added over time, and each will
 * eventually get its own page. The homepage carousel is a query against this,
 * so publishing a project puts it on the site without anyone editing a list.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Réalisation',
    plural: 'Réalisations',
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
    defaultColumns: ['title', 'category', 'city', 'featured', 'order'],
    description: 'Projects shown in the "Nos réalisations" carousel.',
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
      admin: { placeholder: 'EY Ernst & Young' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Generated from the title if left empty. Used for the project page URL.',
      },
      hooks: {
        // Derived on save so every project has a stable URL from day one, even
        // though the detail page does not exist yet. Backfilling slugs onto
        // published documents later is the expensive version of this.
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? slugify(data.title) : undefined),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: PROJECT_CATEGORIES.map(({ value, label }) => ({ value, label })),
      admin: {
        description:
          'Drives the filter buttons on the page Nos projets. A project without a category still appears under « Tous les projets », but no filter will find it.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sector',
          type: 'text',
          label: 'Secteur',
          admin: {
            width: '50%',
            placeholder: 'Multinationale',
            description: 'The line printed on the card, in your own words. Not the filter.',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ville',
          admin: { width: '50%', placeholder: 'Tunis' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Résumé',
      admin: { description: 'One or two lines, shown under the title on the card.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Photo',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Métiers',
      admin: {
        description: 'Shown as tags on the card. Chosen from Métiers so the names cannot drift.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Afficher sur la page d’accueil',
      admin: {
        position: 'sidebar',
        description: 'Only featured projects appear in the homepage carousel.',
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
