import React from 'react'

import { ClientLogos, clientLogosPlaceholder } from '@/blocks/ClientLogos'
import { Expertises } from '@/blocks/Expertises'
import { Hero, heroPlaceholder } from '@/blocks/Hero'
import { Projects } from '@/blocks/Projects'
import { Stats } from '@/blocks/Stats'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'

import type { HomeData } from './getHomeData'

/**
 * The homepage markup, rendered identically by the public and preview routes.
 *
 * Navbar, Hero and ClientLogos are still placeholder-driven — see backlog item 7.
 */
export const HomeView: React.FC<HomeData> = ({ expertises, projects, stats }) => (
  <>
    <Navbar {...navbarPlaceholder} />
    <Hero {...heroPlaceholder} />
    <ClientLogos {...clientLogosPlaceholder} />
    <Stats {...stats} />
    <Expertises {...expertises} />
    <Projects {...projects} />
  </>
)
