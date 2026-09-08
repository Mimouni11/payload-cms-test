import type { Client as PayloadClient } from '@/payload-types'

import { clientLogosPlaceholder } from './placeholder'
import type { ClientLogosProps } from './types'

/**
 * Payload documents → component props.
 *
 * Logos whose upload has not been populated are dropped rather than rendered as
 * a gap in the row, same rule as the other adapters.
 */
export const adaptClientLogos = (docs: PayloadClient[]): ClientLogosProps => ({
  speedSeconds: clientLogosPlaceholder.speedSeconds,
  items: docs.flatMap((doc) => {
    const media = typeof doc.logo === 'object' && doc.logo !== null ? doc.logo : null
    if (!media?.url) return []

    return [
      {
        src: media.url,
        alt: media.alt || doc.name,
        // Payload records the stored dimensions; the row scales to a fixed height.
        width: media.width ?? 200,
        height: media.height ?? 48,
        href: doc.website || undefined,
      },
    ]
  }),
})
