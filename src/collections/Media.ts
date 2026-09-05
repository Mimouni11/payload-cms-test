import type { CollectionConfig } from 'payload'

import { revalidateHomeCollection } from '@/hooks/revalidateHome'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateHomeCollection],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
