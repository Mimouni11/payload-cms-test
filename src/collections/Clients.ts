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
    group: 'Contenu',
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description:
      'Visible sur : le bandeau de logos sous la bannière, présent sur toutes les pages.',
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
        description: 'Sert aussi de texte alternatif au logo (lu par les lecteurs d’écran et Google).',
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
          'Le bandeau affiche tous les logos à la même hauteur : importez-le recadré au plus près, car des marges en trop le font paraître plus petit que ses voisins. PNG transparent ou SVG.',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Site web',
      admin: {
        placeholder: 'https://…',
        description: 'Facultatif. Rend le logo cliquable.',
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
