import type { CollectionConfig } from 'payload'

import { GROUP } from '@/admin/i18n'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { fr: 'Média', en: 'Media' },
    plural: { fr: 'Médias', en: 'Media' },
  },
  access: {
    read: () => true,
  },
  admin: {
    group: GROUP.files,
    description: {
      fr: 'Toutes les images du site. Remplacer le fichier d’un média le change partout où il est utilisé — pour ne changer qu’un seul endroit, retirez l’image (×) dans la page concernée puis importez-en une nouvelle.',
      en: 'Every image on the site. Replacing a media file changes it everywhere it is used — to change just one place, remove the image (×) on that page and upload a new one.',
    },
  },
  hooks: {
    afterChange: [revalidateHomeCollection],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: { fr: 'Texte alternatif', en: 'Alt text' },
      admin: {
        description: {
          fr: 'Une courte description de l’image, lue par les lecteurs d’écran et Google. Exemple : « Open space avec cloisons vitrées ».',
          en: 'A short description of the image, read by screen readers and Google. Example: “Open-plan office with glass partitions”.',
        },
      },
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
