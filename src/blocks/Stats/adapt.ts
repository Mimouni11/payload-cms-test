import type { Stat as PayloadStats } from '@/payload-types'

import type { StatsProps } from './types'

/**
 * Payload document → component props.
 *
 * Payload returns every optional field as `null`; the props contract uses
 * `undefined`, and `value` is nullable in the generated type even though the
 * field is required, so rows without one are dropped rather than rendered as NaN.
 */
export const adaptStats = (doc: PayloadStats): StatsProps => ({
  items: (doc.items ?? []).flatMap((row) => {
    if (typeof row.value !== 'number') return []

    return [
      {
        prefix: row.prefix ?? undefined,
        value: row.value,
        suffix: row.suffix ?? undefined,
        decimals: row.decimals ?? undefined,
        label: row.label,
      },
    ]
  }),
})
