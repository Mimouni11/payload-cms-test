import React from 'react'

import { getHomeData } from './_home/getHomeData'
import { HomeView } from './_home/HomeView'
import './styles.css'

/**
 * The public homepage. Statically rendered and served from the CDN — no function
 * invocation and no database query per visitor. Published content only; drafts
 * live at /preview.
 *
 * `force-static` is a guard, not a preference: it errors if a dynamic API such as
 * draftMode(), cookies() or headers() is reintroduced here, which is exactly how
 * this route became dynamic in the first place.
 *
 * Kept current by revalidatePath('/') in src/hooks/revalidateHome.ts.
 */
export const dynamic = 'force-static'

export default async function HomePage() {
  const data = await getHomeData({ draft: false })

  return <HomeView {...data} />
}
