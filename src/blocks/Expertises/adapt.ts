import type { Expertise as PayloadExpertises } from '@/payload-types'

import type { ExpertisesProps } from './types'

/**
 * Payload document → component props.
 *
 * The two shapes diverge in three places, which is why this exists rather than
 * spreading the document straight in:
 *   - `image` comes back as a Media object (or a bare id at depth 0)
 *   - the link is two flat fields, not a nested object
 *   - `headingLines` is an array of rows, not an array of strings
 */
export const adaptExpertises = (doc: PayloadExpertises): ExpertisesProps => ({
  badge: doc.badge ?? undefined,
  headingLines: (doc.headingLines ?? [])
    .map((row) => row.text)
    .filter((text): text is string => Boolean(text)),
  items: (doc.items ?? []).flatMap((row) => {
    // depth 0 returns an id; without a populated upload there is nothing to show.
    const media = typeof row.image === 'object' && row.image !== null ? row.image : null
    if (!media?.url) return []

    return [
      {
        title: row.title,
        description: row.description ?? undefined,
        link: row.linkLabel ? { label: row.linkLabel, href: row.linkHref || '#' } : undefined,
        image: {
          src: media.url,
          alt: media.alt || row.title,
          caption: row.caption ?? undefined,
        },
      },
    ]
  }),
})
