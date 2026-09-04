export type Stat = {
  /** Rendered before the number, e.g. "+". */
  prefix?: string
  value: number
  /** Rendered after the number, e.g. "k". */
  suffix?: string
  /** Decimal places to show while counting and at rest. */
  decimals?: number
  label: string
}

export type StatsProps = {
  items: Stat[]
}
