import { ClientLogos, clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import './styles.css'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Placeholder data for now. Wiring step swaps these for Payload queries —
  // the components take props and never change.
  return (
    <>
      <Navbar {...navbarPlaceholder} />
      <Hero {...heroPlaceholder} />
      <ClientLogos {...clientLogosPlaceholder} />
    </>
  )
}
