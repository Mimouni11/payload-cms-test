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
    group: 'Contenu',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'city', 'featured', 'order'],
    description:
      'Visible sur : la page Nos projets (toutes), et le carrousel de la page d’accueil (uniquement celles cochées « Afficher sur la page d’accueil »).',
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
      label: 'Titre',
      admin: { placeholder: 'EY Ernst & Young' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Identifiant URL',
      admin: {
        position: 'sidebar',
        description:
          'Rempli automatiquement à partir du titre si vous le laissez vide. Sert à l’adresse de la page du projet.',
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
          'Détermine les boutons de filtre de la page Nos projets. Un projet sans catégorie apparaît quand même dans « Tous les projets », mais aucun filtre ne le trouvera.',
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
            description: 'La ligne affichée sur la carte, avec vos propres mots. Ce n’est pas le filtre.',
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
      admin: { description: 'Une ou deux lignes, affichées sous le titre sur la carte.' },
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
        description:
          'Affichés en étiquettes sur la carte. Choisis dans la liste des Métiers pour que les noms restent toujours identiques.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Afficher sur la page d’accueil',
      admin: {
        position: 'sidebar',
        description:
          'Seules les réalisations cochées apparaissent dans le carrousel de la page d’accueil.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Ordre d’affichage',
      admin: {
        position: 'sidebar',
        description: 'Les plus petits numéros apparaissent en premier.',
      },
    },
  ],
}
