import type { GlobalConfig } from 'payload'

import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * The company's practical details — address, phone, email, opening hours.
 *
 * Lives in `src/globals/` rather than beside a block because it belongs to no
 * single section: the contact section renders these with labels and icons, the
 * footer renders the values alone, and the map geocodes the address. Before this
 * existed the same address was written in three places and had already drifted
 * ("Ariana Tunisie" in one, "Ariana" in another).
 */
export const SiteInfoGlobal: GlobalConfig = {
  slug: 'site-info',
  label: 'Coordonnées',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    description: 'Used by the contact section, the map and the footer.',
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'site-info' },
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
      name: 'details',
      type: 'array',
      label: 'Coordonnées',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Coordonnée', plural: 'Coordonnées' },
      admin: {
        description:
          'Shown with a heading and icon in the contact section, and as plain lines in the footer. Drag to reorder.',
      },
      defaultValue: [
        { label: 'Adresse', value: 'Rue Fatma Ezzahra, Ariana Tunisie', icon: 'location' },
        { label: 'Téléphone', value: '+216 31 536 548', icon: 'phone' },
        { label: 'Email', value: 'contact@groupebigart.tn', icon: 'mail' },
        { label: 'Horaires', value: 'Lun. Ven. 8h00 à 17h30', icon: 'clock' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Intitulé',
              admin: { width: '30%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Valeur',
              admin: { width: '45%' },
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'location',
              label: 'Icône',
              admin: { width: '25%' },
              // Fixed list: each maps to an icon drawn in the component, so a row
              // can never render without one.
              options: [
                { label: 'Adresse', value: 'location' },
                { label: 'Téléphone', value: 'phone' },
                { label: 'Email', value: 'mail' },
                { label: 'Horaires', value: 'clock' },
              ],
            },
          ],
        },
        {
          name: 'inFooter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Afficher dans le pied de page',
          admin: {
            description: 'Opening hours are usually left out of the footer.',
          },
        },
      ],
    },
    {
      name: 'mapQuery',
      type: 'text',
      label: 'Adresse pour la carte',
      admin: {
        description:
          'Geocoded by the map provider. Leave empty to use the first address above.',
        placeholder: 'Rue Fatma Ezzahra, Ariana, Tunisie',
      },
    },
  ],
}
