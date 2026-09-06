import { asset } from '@/utilities/asset'

import type { ClientLogosProps } from './types'

/**
 * Stand-in content until this block is wired to Payload.
 * Reusable afterwards as seed data — see docs/content-architecture.md.
 */
export const clientLogosPlaceholder: ClientLogosProps = {
  speedSeconds: 60,
  items: [
    { src: asset('/sofrecom.webp'), alt: 'Sofrecom', width: 64, height: 48 },
    { src: asset('/inetum.webp'), alt: 'Inetum', width: 220, height: 48 },
    { src: asset('/BH.webp'), alt: 'BH Bank', width: 115, height: 48 },
    { src: asset('/mcpharma.webp'), alt: 'MC Pharma', width: 241, height: 48 },
    { src: asset('/attijari.webp'), alt: 'Attijari Bank', width: 180, height: 48 },
  ],
}
