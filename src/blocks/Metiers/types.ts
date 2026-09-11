export type MetierPhoto = {
  src: string
  alt: string
  /** Shown in the bar across the bottom of the photo. */
  caption?: string
}

export type Metier = {
  title: string
  description?: string
  /** Set only when the métier points somewhere real; the arrow is drawn either way. */
  href?: string
  /** Never empty — the adapter drops a métier with no usable photo rather than
   *  rendering an empty frame. */
  photos: MetierPhoto[]
}

export type MetiersProps = {
  items: Metier[]
}
