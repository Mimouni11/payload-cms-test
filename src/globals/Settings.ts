import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  versions: {
    drafts: { schedulePublish: true },
    max: 20,
  },
  fields: [
    {
      name: 'theme',
      type: 'select',
      required: true,
      defaultValue: 'meridian',
      label: 'Site theme',
      options: [
        { label: 'Meridian — teal & coral', value: 'meridian' },
        { label: 'Dusk — plum & rose', value: 'dusk' },
        { label: 'Terra — forest & clay', value: 'terra' },
      ],
      admin: {
        description: 'Recolours the entire site. Applies to every page, not just the homepage.',
      },
    },
  ],
}
