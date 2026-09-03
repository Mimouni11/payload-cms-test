export type HeroProps = {
  /** Small pill above the headline. Omit to hide it. */
  badge?: string
  title: string
  lede?: string
  cta: {
    label: string
    href: string
  }
  image: {
    src: string
    alt: string
  }
}
