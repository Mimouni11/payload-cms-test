export type ProjectCardData = {
  title: string
  /** Rendered as "Secteur. Ville." in the red meta line. */
  sector?: string
  city?: string
  summary?: string
  /**
   * Category slug, matching a `PROJECT_CATEGORIES` value. Drives the filter row
   * on /projets and is never displayed — the visible line is `sector`.
   * Undefined means the project only ever shows under "Tous les projets".
   */
  category?: string
  /** Service names, shown as tags. */
  tags: string[]
  href: string
  image: {
    src: string
    alt: string
  }
}

export type ProjectsProps = {
  badge?: string
  /** Rendered one per line, so the break is deliberate rather than reflowed. */
  headingLines: string[]
  cta?: {
    label: string
    href: string
  }
  items: ProjectCardData[]
}
