import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ClientLogos, clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { Expertises } from '@/blocks/Expertises'
import { adaptExpertises } from '@/blocks/Expertises/adapt'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import './styles.css'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const { isEnabled: draft } = await draftMode()

  // depth 1 populates the upload on each row.
  const expertisesDoc = await payload.findGlobal({ slug: 'expertises', draft, depth: 1 })
  const expertisesProps = adaptExpertises(expertisesDoc)

  return (
    <>
      <Navbar {...navbarPlaceholder} />
      <Hero {...heroPlaceholder} />
      <ClientLogos {...clientLogosPlaceholder} />
      <Expertises {...expertisesProps} />
    </>
  )
}
