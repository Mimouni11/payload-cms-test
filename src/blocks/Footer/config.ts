import type { GlobalConfig } from 'payload'

import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Footer content.
 *
 * The "Nos métiers" column is deliberately absent from these fields: it reads
 * from the `services` collection, so adding a métier puts it in the footer with
 * no second edit. Only its heading is editable here.
 */
export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: 'Pied de page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'footer' },
          },
        ],
      },
    },
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }&path=/preview`,
    },
  },
  hooks: {
    afterChange: [revalidateHomeGlobal],
  },
  lockDocuments: false,
  versions: {
    drafts: { autosave: { interval: 1000 } },
    max: 30,
  },
  fields: [
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Texte sous le logo',
      defaultValue:
        'Spécialiste tunisien de l’espace professionnel. Conception, fourniture et réalisation sous un même toit depuis 2008.',
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Réseaux sociaux',
      maxRows: 6,
      labels: { singular: 'Réseau', plural: 'Réseaux' },
      admin: { description: 'Drag to reorder. The icon comes from the platform chosen.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              label: 'Plateforme',
              admin: { width: '40%' },
              // A fixed list, not a free icon field: each option maps to an icon
              // drawn in the component, so the row can never render a blank.
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'X', value: 'x' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Lien',
              admin: { width: '60%', placeholder: 'https://…' },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'navTitle',
          type: 'text',
          label: 'Titre — colonne navigation',
          defaultValue: 'Navigation',
          admin: { width: '33%' },
        },
        {
          name: 'servicesTitle',
          type: 'text',
          label: 'Titre — colonne métiers',
          defaultValue: 'Nos métiers',
          admin: {
            width: '33%',
            description: 'The entries come from Métiers automatically.',
          },
        },
        {
          name: 'contactTitle',
          type: 'text',
          label: 'Titre — colonne contact',
          defaultValue: 'Contact',
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Liens de navigation',
      maxRows: 10,
      labels: { singular: 'Lien', plural: 'Liens' },
      defaultValue: [
        { label: 'A propos', href: '#a-propos' },
        { label: 'Nos métiers', href: '#expertises' },
        { label: 'Nos projets', href: '#projets' },
        { label: 'Actualités', href: '#actualites' },
        { label: 'Contact', href: '#contact' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'contactLines',
      type: 'array',
      label: 'Coordonnées',
      maxRows: 6,
      labels: { singular: 'Ligne', plural: 'Lignes' },
      admin: { description: 'One line each. Emails and phone numbers become links.' },
      defaultValue: [
        { text: 'Rue Fatma Ezzahra, Ariana' },
        { text: '+216 31 536 548' },
        { text: 'contact@groupebigart.tn' },
      ],
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'legal',
      type: 'text',
      label: 'Mention en bas de page',
      defaultValue: 'Crafted by BigArt | 2026',
    },
  ],
}
