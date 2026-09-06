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
  upload: {
    /**
     * Every upload is capped and re-encoded before it is stored.
     *
     * This is the only place the problem can be solved. Editors upload straight
     * from a camera or a designer's export — an 8 MB PNG of a photograph once
     * took the homepage to a 29-second render and timed out Next's image
     * optimiser outright. Asking people to compress first does not work.
     *
     * `next/image` already serves WebP to the browser regardless of what is
     * stored, so this is not about what visitors download. It is about what the
     * optimiser has to fetch and re-encode on every cache miss, which is where
     * the failure actually was.
     *
     * 2400px is comfortably above the largest rendered size on the site.
     */
    resizeOptions: {
      width: 2400,
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
  },
}
