import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ClientLogos, clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { Hero } from '@/blocks/Hero'
import { adaptProjects, ProjectsGrid } from '@/blocks/Projects'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * Every project, not just the featured ones.
 *
 * Same chrome as the homepage — navbar, hero, client logos, footer — with a
 * different hero image and copy. Static like `/`, and kept current by the same
 * revalidation hook, which lists this path.
 */
export const dynamic = 'force-static'

const hero = {
  badge: 'Nos projets',
  title: 'Des espaces qui parlent d’eux-mêmes.',
  lede: 'Plus de 1 000 projets livrés depuis 2008. Multinationales, banques, industrie, santé. Chaque réalisation est unique. Chaque espace raconte son client.',
  cta: { label: 'Découvrir nos réalisations', href: '#realisations' },
  image: {
    src: asset('/projects_hero.webp'),
    alt: 'Vue en plongée d’un escalier dans un espace de bureaux',
  },
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config: await config })

  const [projectsResult, footerDoc, servicesResult] = await Promise.all([
    // No `featured` filter here — that is what separates this from the homepage.
    payload.find({ collection: 'projects', depth: 1, limit: 100, sort: 'order' }),
    payload.findGlobal({ slug: 'footer', depth: 0 }),
    payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
  ])

  const projects = adaptProjects(projectsResult.docs)

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/projets" />
      <Hero {...hero} />
      <ClientLogos {...clientLogosPlaceholder} />
      <div id="realisations">
        <ProjectsGrid items={projects.items} />
      </div>
      <Footer {...adaptFooter(footerDoc, servicesResult.docs)} />
    </>
  )
}
