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
    group: 'Contenu',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description:
      'Visible sur : la page d’accueil (section Nos métiers), la page Nos métiers, et le menu du pied de page de toutes les pages. Sert aussi à étiqueter les réalisations.',
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
      admin: { placeholder: 'Cloisonnement' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Texte',
      admin: { description: 'Affiché quand la ligne de l’accordéon est ouverte. Facultatif.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Photo principale',
      admin: { description: 'Affichée dans l’accordéon de la page d’accueil.' },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende de la photo principale',
      admin: { description: 'Affichée sur la photo, en bas à gauche. Facultatif.' },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description:
          'Carrousel de la page Nos métiers. Ajoutez autant de photos que vous voulez et faites-les glisser pour changer l’ordre. Si la galerie est vide, le carrousel affiche la photo principale : rien ne casse, il ne défile simplement pas.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Légende',
          admin: {
            description: 'Affichée dans la barre en bas de cette photo. Facultatif.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Texte du lien',
          defaultValue: 'Découvrir',
          admin: { width: '50%' },
        },
        {
          name: 'linkHref',
          type: 'text',
          label: 'Adresse du lien',
          defaultValue: '#',
          admin: { width: '50%' },
        },
      ],
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
