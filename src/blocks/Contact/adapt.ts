import type { SiteInfo as PayloadSiteInfo } from '@/payload-types'

import { contactPlaceholder } from './placeholder'
import type { ContactDetail, ContactProps } from './types'

/**
 * Section chrome stays hardcoded; the practical details come from the
 * `site-info` global so the address is written once and used by the contact
 * section, the map and the footer.
 */
export const adaptContact = (siteInfo: PayloadSiteInfo): ContactProps => {
  const details: ContactDetail[] = (siteInfo.details ?? []).flatMap((row) =>
    row.label && row.value
      ? [{ label: row.label, value: row.value, icon: row.icon as ContactDetail['icon'] }]
      : [],
  )

  // The map falls back to the first address so an editor need not repeat it.
  const firstAddress = details.find((detail) => detail.icon === 'location')?.value
  const query = siteInfo.mapQuery || firstAddress || contactPlaceholder.map.query

  return {
    ...contactPlaceholder,
    map: { query, label: `Carte — ${query}` },
    details: details.length > 0 ? details : contactPlaceholder.details,
  }
}
