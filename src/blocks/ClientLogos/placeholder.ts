import type { ClientLogosProps } from './types'

/**
 * Stand-in content until this block is wired to Payload.
 * Reusable afterwards as seed data — see docs/content-architecture.md.
 */
export const clientLogosPlaceholder: ClientLogosProps = {
  speedSeconds: 60,
  items: [
    { src: '/sofrecom.png', alt: 'Sofrecom', width: 64, height: 48 },
    { src: '/inetum.png', alt: 'Inetum', width: 220, height: 48 },
    { src: '/BH.png', alt: 'BH Bank', width: 115, height: 48 },
    { src: '/mcpharma.png', alt: 'MC Pharma', width: 241, height: 48 },
    { src: '/attijari.png', alt: 'Attijari Bank', width: 180, height: 48 },
  ],
}
