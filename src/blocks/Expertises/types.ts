export type Expertise = {
  title: string
  /** Absent until the copy exists — the open panel simply renders empty. */
  description?: string
  link?: {
    label: string
    href: string
  }
  image: {
    src: string
    alt: string
    /** Overlaid on the image, bottom left. */
    caption?: string
  }
}

export type ExpertisesProps = {
  badge?: string
  /** Rendered one per line, so the break is deliberate rather than reflowed. */
  headingLines: string[]
  items: Expertise[]
}
