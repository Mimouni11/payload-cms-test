import type { GlobalConfig } from 'payload'

import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Footer content.
 *
 * Two columns are deliberately absent from these fields:
 *   - "Nos métiers" reads from the `services` collection
 *   - "Contact" reads from the `site-info` global
 *
 * Both are edited in one place and appear wherever they are used, rather than
 * being retyped per section. Only their headings are editable here.
 */
export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: 'Pied de page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Tout le site',
    description:
      'Visible sur : le pied de page de toutes les pages. Les liens « Nos métiers » se remplissent tout seuls depuis la collection Métiers ; les coordonnées viennent de Coordonnées.',
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
      admin: {
        description:
          'L’icône dépend de la plateforme choisie. Faites-les glisser pour changer l’ordre.',
      },
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
            description: 'Les liens de cette colonne viennent automatiquement de Métiers.',
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
        { label: 'Nos projets', href: '/projets' },
        { label: 'Actualités', href: '#actualites' },
        { label: 'Contact', href: '#contact' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Texte',
              admin: { width: '50%' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: 'Lien',
              admin: { width: '50%', placeholder: '/projets' },
            },
          ],
        },
      ],
    },
    {
      name: 'legal',
      type: 'text',
      label: 'Mention en bas de page',
      defaultValue: 'Crafted by BigArt | 2026',
    },
  ],
}
