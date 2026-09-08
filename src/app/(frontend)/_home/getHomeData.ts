import { getPayload } from 'payload'

import config from '@/payload.config'
import { adaptClientLogos, type ClientLogosProps } from '@/blocks/ClientLogos'
import { adaptContact, type ContactProps } from '@/blocks/Contact'
import { adaptExpertises, type ExpertisesProps } from '@/blocks/Expertises'
import { adaptFooter, type FooterProps } from '@/blocks/Footer'
import { adaptProjects, type ProjectsProps } from '@/blocks/Projects'
import { adaptStats, type StatsProps } from '@/blocks/Stats'
import type {
  Client as PayloadClient,
  Expertise as PayloadExpertises,
  Footer as PayloadFooter,
  Project as PayloadProject,
  Service as PayloadService,
  SiteInfo as PayloadSiteInfo,
  Stat as PayloadStats,
} from '@/payload-types'

export type HomeData = {
  clientLogos: ClientLogosProps
  contact: ContactProps
  footer: FooterProps
  projects: ProjectsProps
  expertises: ExpertisesProps
  stats: StatsProps
}

export type HomeDocs = {
  clients: PayloadClient[]
  footerDoc: PayloadFooter
  siteInfo: PayloadSiteInfo
  projects: PayloadProject[]
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

  const [expertisesDoc, statsDoc, footerDoc, siteInfo, clientsResult, servicesResult, projectsResult] =
    await Promise.all([
    payload.findGlobal({ slug: 'expertises', draft, depth: EXPERTISES_DEPTH }),
    payload.findGlobal({ slug: 'stats', draft, depth: STATS_DEPTH }),
    payload.findGlobal({ slug: 'footer', draft, depth: 0 }),
    payload.findGlobal({ slug: 'site-info', draft, depth: 0 }),
    payload.find({ collection: 'clients', draft, depth: 1, limit: 50, sort: 'order' }),
    payload.find({
      collection: 'services',
      draft,
      depth: EXPERTISES_DEPTH,
      limit: 20,
      sort: 'order',
    }),
    payload.find({
      collection: 'projects',
      draft,
      // depth 1 populates both the image and the service relationships, which
      // supply the card's tag names.
      depth: 1,
      limit: 12,
      sort: 'order',
      where: { featured: { equals: true } },
    }),
  ])

  return {
    expertisesDoc,
    footerDoc,
    siteInfo,
    clients: clientsResult.docs,
    projects: projectsResult.docs,
    services: servicesResult.docs,
    statsDoc,
  }
}

/**
 * Adapted props for the homepage. Used by the static public route, which has no
 * live updates to apply.
 */
export const getHomeData = async ({ draft }: { draft: boolean }): Promise<HomeData> => {
  const { clients, expertisesDoc, footerDoc, projects, services, siteInfo, statsDoc } =
    await getHomeDocs({ draft })

  return {
    expertises: adaptExpertises(expertisesDoc, services),
    clientLogos: adaptClientLogos(clients),
    contact: adaptContact(siteInfo),
    footer: adaptFooter(footerDoc, services, siteInfo),
    projects: adaptProjects(projects),
    stats: adaptStats(statsDoc),
  }
}
