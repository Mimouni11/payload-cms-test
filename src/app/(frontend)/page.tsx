import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ClientLogos, clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { Expertises } from '@/blocks/Expertises'
import { adaptExpertises } from '@/blocks/Expertises/adapt'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { Stats, adaptStats } from '@/blocks/Stats'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import './styles.css'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const { isEnabled: draft } = await draftMode()

  // depth 1 populates the upload on each row.
  const [expertisesDoc, statsDoc] = await Promise.all([
    payload.findGlobal({ slug: 'expertises', draft, depth: 1 }),
    payload.findGlobal({ slug: 'stats', draft, depth: 0 }),
  ])

  const expertisesProps = adaptExpertises(expertisesDoc)
  const statsProps = adaptStats(statsDoc)

  return (
    <>
      <Navbar {...navbarPlaceholder} />
      <Hero {...heroPlaceholder} />
      <ClientLogos {...clientLogosPlaceholder} />
      <Stats {...statsProps} />
      <Expertises {...expertisesProps} />
    </>
  )
}
