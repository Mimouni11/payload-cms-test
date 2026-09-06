import type { Project as PayloadProject } from '@/payload-types'

import type { ProjectsProps } from './types'

/** Section chrome is not editable yet — see backlog item 7. */
const CHROME = {
  badge: 'Nos Réalisations',
  headingLines: ['Des espaces qui parlent', 'd’eux-mêmes.'],
  cta: { label: 'Voir tous les projets', href: '#' },
}

/**
 * Payload documents → component props.
 *
 * Projects whose image has not been populated are dropped rather than rendered
 * with a broken card, same rule as the expertises adapter.
 */
export const adaptProjects = (docs: PayloadProject[]): ProjectsProps => ({
  ...CHROME,
  items: docs.flatMap((doc) => {
    const media = typeof doc.image === 'object' && doc.image !== null ? doc.image : null
    if (!media?.url) return []

    return [
      {
        title: doc.title,
        sector: doc.sector ?? undefined,
        city: doc.city ?? undefined,
        summary: doc.summary ?? undefined,
        // Relationships come back as ids at depth 0; only populated ones have a title.
        tags: (doc.services ?? []).flatMap((service) =>
          typeof service === 'object' && service !== null ? [service.title] : [],
        ),
        href: doc.slug ? `/projets/${doc.slug}` : '#',
        image: {
          src: media.url,
          alt: media.alt || doc.title,
        },
      },
    ]
  }),
})
