export type ContactDetail = {
  label: string
  value: string
  icon: 'location' | 'phone' | 'mail' | 'clock'
}

export type ContactProps = {
  /** Rendered one per line, so the break is deliberate rather than reflowed. */
  headingLines: string[]
  map: {
    /** Geocoded by the map provider, so no coordinates are hard-coded here. */
    query: string
    /** Accessible name for the embedded frame. */
    label: string
  }
  fields: {
    name: { label: string; placeholder: string }
    company: { label: string; placeholder: string }
    email: { label: string; placeholder: string }
    message: { label: string; placeholder: string }
  }
  servicesLabel: string
  /** Chip options — the services an enquiry can concern. */
  services: string[]
  submitLabel: string
  details: ContactDetail[]
}
