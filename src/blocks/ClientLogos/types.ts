export type ClientLogo = {
  src: string
  alt: string
  /** Intrinsic size of the asset; CSS normalises every logo to one height. */
  width: number
  height: number
}

export type ClientLogosProps = {
  items: ClientLogo[]
  /**
   * Seconds for one full loop. Higher is slower. Because the track length grows
   * with the number of logos, adjust this if you add or remove several.
   */
  speedSeconds?: number
}
