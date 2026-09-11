import type { GlobalConfig } from 'payload'

import { revalidateHomeGlobal } from '@/hooks/revalidateHome'

/**
 * Chrome for the expertises section — the label and the heading.
 *
 * The entries themselves live in the `services` collection, not here. They moved
 * out when projects needed to tag themselves with them: as rows in an array they
 * would have been duplicated as free text on every project and drifted the moment
 * someone typed "Signalitique".
 *
 * A global because there is exactly one of these headings on the homepage.
 */
export const ExpertisesGlobal: GlobalConfig = {
  slug: 'expertises',
  label: 'Nos métiers (titre)',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Page d’accueil',
    description:
      'Visible sur : la page d’accueil uniquement — le titre au-dessus de la section Nos métiers. Les métiers eux-mêmes se modifient dans Contenu → Métiers.',
    components: {
      elements: {
        beforeDocumentControls: [
          {
            path: '@/components/admin/PublishStatus#PublishStatus',
            clientProps: { globalSlug: 'expertises' },
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
      name: 'badge',
      type: 'text',
      label: 'Surtitre',
      defaultValue: 'Nos métiers',
    },
    {
      name: 'headingLines',
      type: 'array',
      label: 'Titre',
      maxRows: 3,
      labels: { singular: 'Ligne', plural: 'Lignes' },
      admin: {
        description:
          'Chaque ligne ajoutée ici s’affiche sur sa propre ligne à l’écran, quelle que soit la taille de l’écran.',
      },
      defaultValue: [{ text: 'Six expertises.' }, { text: 'Une seule équipe.' }],
      fields: [{ name: 'text', type: 'text', required: true, label: 'Texte' }],
    },
  ],
}
