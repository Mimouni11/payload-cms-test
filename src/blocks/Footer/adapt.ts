import { asset } from '@/utilities/asset'
import type { Footer as PayloadFooter, Service as PayloadService } from '@/payload-types'

import type { FooterProps, SocialPlatform } from './types'

/**
 * Payload documents → component props.
 *
 * Two sources: the global owns the copy and links, the `services` collection
 * owns the "Nos métiers" column. Adding a métier puts it in the footer with no
 * second edit — which is the reason that column is not a field.
 */
export const adaptFooter = (doc: PayloadFooter, services: PayloadService[]): FooterProps => ({
  brand: {
    src: asset('/logo.webp'),
    alt: 'BigArt Group',
    width: 122,
    height: 52,
  },
  tagline: doc.tagline ?? undefined,
  socials: (doc.socials ?? []).flatMap((row) =>
    row.platform && row.url
      ? [{ platform: row.platform as SocialPlatform, url: row.url }]
      : [],
  ),
  navTitle: doc.navTitle ?? undefined,
  navLinks: (doc.navLinks ?? []).flatMap((row) =>
    row.label && row.href ? [{ label: row.label, href: row.href }] : [],
  ),
  servicesTitle: doc.servicesTitle ?? undefined,
  services: services.map((service) => ({
    label: service.title,
    // No detail pages yet, so these point at the homepage section.
    href: '#expertises',
  })),
  contactTitle: doc.contactTitle ?? undefined,
  contactLines: (doc.contactLines ?? []).flatMap((row) => (row.text ? [row.text] : [])),
  legal: doc.legal ?? undefined,
})
