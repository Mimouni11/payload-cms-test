export type SocialPlatform = 'facebook' | 'instagram' | 'x' | 'linkedin'

export type FooterLink = {
  label: string
  href: string
}

export type FooterProps = {
  brand: {
    src: string
    alt: string
    width: number
    height: number
  }
  tagline?: string
  socials: {
    platform: SocialPlatform
    url: string
  }[]
  navTitle?: string
  navLinks: FooterLink[]
  servicesTitle?: string
  /** Read from the services collection, not editable in the footer global. */
  services: FooterLink[]
  contactTitle?: string
  contactLines: string[]
  legal?: string
}
