export type NewsArticle = {
  title: string
  /** Rendered as "Catégorie. Date." in the small pill above the title. */
  category?: string
  date?: string
  href: string
  image: {
    src: string
    alt: string
  }
}

export type NewsProps = {
  badge?: string
  /** Rendered one per line, so the break is deliberate rather than reflowed. */
  headingLines: string[]
  cta?: {
    label: string
    href: string
  }
  items: NewsArticle[]
}
