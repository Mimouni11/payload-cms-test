export type NavLink = {
  label: string
  href: string
}

export type NavbarProps = {
  brand: {
    src: string
    alt: string
    /** Intrinsic pixel size of the asset; CSS controls the rendered size. */
    width: number
    height: number
    href: string
  }
  links: NavLink[]
  cta: NavLink
}
