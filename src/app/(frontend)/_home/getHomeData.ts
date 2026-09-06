import { getPayload } from 'payload'

import config from '@/payload.config'
import { adaptExpertises, type ExpertisesProps } from '@/blocks/Expertises'
import { adaptStats, type StatsProps } from '@/blocks/Stats'
import type {
  Expertise as PayloadExpertises,
  Service as PayloadService,
  Stat as PayloadStats,
} from '@/payload-types'

export type HomeData = {
  expertises: ExpertisesProps
  stats: StatsProps
}

export type HomeDocs = {
  expertisesDoc: PayloadExpertises
  services: PayloadService[]
  statsDoc: PayloadStats
}

/** depth 1 on expertises is load-bearing — see getHomeDocs. */
export const EXPERTISES_DEPTH = 1
export const STATS_DEPTH = 0

/**
 * Raw Payload documents for the homepage.
 *
 * The preview route needs these unadapted, because live-preview messages arrive
 * as documents and must be adapted client-side on every update.
 *
 * `adaptExpertises` drops any row whose image is not a populated object with a
 * url, so depth 0 there would render an empty carousel.
 */
export const getHomeDocs = async ({ draft }: { draft: boolean }): Promise<HomeDocs> => {
  const payload = await getPayload({ config: await config })

  const [expertisesDoc, statsDoc, servicesResult] = await Promise.all([
    payload.findGlobal({ slug: 'expertises', draft, depth: EXPERTISES_DEPTH }),
    payload.findGlobal({ slug: 'stats', draft, depth: STATS_DEPTH }),
    payload.find({
      collection: 'services',
      draft,
      depth: EXPERTISES_DEPTH,
      limit: 20,
      sort: 'order',
    }),
  ])

  return { expertisesDoc, services: servicesResult.docs, statsDoc }
}

/**
 * Adapted props for the homepage. Used by the static public route, which has no
 * live updates to apply.
 */
export const getHomeData = async ({ draft }: { draft: boolean }): Promise<HomeData> => {
  const { expertisesDoc, services, statsDoc } = await getHomeDocs({ draft })

  return {
    expertises: adaptExpertises(expertisesDoc, services),
    stats: adaptStats(statsDoc),
  }
}
