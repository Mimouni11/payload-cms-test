import type { GlobalConfig } from 'payload'

import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Editable source for the red statistics band.
 *
 * A global: there is one of these, with fixed slots. Each row is one figure;
 * the number counts up on screen, so `value` must stay numeric — the prefix and
 * suffix exist so "+1k" is still a number the animation can run on.
 */
export const StatsGlobal: GlobalConfig = {
  slug: 'stats',
  label: 'Chiffres clés',
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
            clientProps: { globalSlug: 'stats' },
          },
        ],
      },
    },
    livePreview: {
      // path=/preview keeps the editor off the public route, which is static.
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/preview?secret=${
        process.env.PREVIEW_SECRET || ''
      }&path=/preview`,
    },
  },
  hooks: {
    afterChange: [revalidateHomeGlobal],
  },
  // Single-editor site: locking exists to stop concurrent editors colliding, and
  // its two-step insert races under rapid autosave.
  lockDocuments: false,
  versions: {
    // 200ms fired five times a second and, with live preview's mergeData calls on
    // top, was enough to lose that race. 1s is imperceptible while editing.
    drafts: { autosave: { interval: 1000 }, schedulePublish: true },
    max: 30,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Chiffres',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Chiffre', plural: 'Chiffres' },
      admin: { description: 'Drag to reorder. Shown left to right in the red band.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'prefix',
              type: 'text',
              label: 'Prefix',
              admin: { width: '20%', placeholder: '+', description: 'Optional.' },
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              label: 'Number',
              admin: { width: '30%', description: 'Digits only — this is what animates.' },
            },
            {
              name: 'suffix',
              type: 'text',
              label: 'Suffix',
              admin: { width: '20%', placeholder: 'k', description: 'Optional.' },
            },
            {
              name: 'decimals',
              type: 'number',
              label: 'Decimals',
              defaultValue: 0,
              min: 0,
              max: 2,
              admin: { width: '30%' },
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Caption',
          admin: { placeholder: 'ans d’expertise' },
        },
      ],
    },
  ],
}
