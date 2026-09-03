import { asset } from '@/utilities/asset'

import type { ClientLogosProps } from './types'

/**
 * Stand-in content until this block is wired to Payload.
 * Reusable afterwards as seed data — see docs/content-architecture.md.
 */
export const clientLogosPlaceholder: ClientLogosProps = {
  speedSeconds: 60,
  items: [
    { src: asset('/sofrecom.png'), alt: 'Sofrecom', width: 64, height: 48 },
    { src: asset('/inetum.png'), alt: 'Inetum', width: 220, height: 48 },
    { src: asset('/BH.png'), alt: 'BH Bank', width: 115, height: 48 },
    { src: asset('/mcpharma.png'), alt: 'MC Pharma', width: 241, height: 48 },
    { src: asset('/attijari.png'), alt: 'Attijari Bank', width: 180, height: 48 },
  ],
}
