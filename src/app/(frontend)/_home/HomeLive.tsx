'use client'

import React from 'react'

import { adaptExpertises } from '@/blocks/Expertises'
import { adaptStats } from '@/blocks/Stats'
import type { Expertise as PayloadExpertises, Stat as PayloadStats } from '@/payload-types'

import { HomeView } from './HomeView'
import { useGlobalPreview } from './useGlobalPreview'

type Props = {
  expertisesDoc: PayloadExpertises
  statsDoc: PayloadStats
}

/**
 * Preview-only wrapper. Subscribes each global to the live-preview channel and
 * re-renders the same HomeView the public route uses, so the two cannot diverge.
 *
 * depth 1 on expertises matches the server fetch — adaptExpertises drops any row
 * whose image is not a populated object, so a shallower merge would blank the
 * carousel every time the editor typed.
 */
export const HomeLive: React.FC<Props> = ({ expertisesDoc, statsDoc }) => {
  const expertises = useGlobalPreview<PayloadExpertises>('expertises', expertisesDoc, 1)
  const stats = useGlobalPreview<PayloadStats>('stats', statsDoc, 0)

  return <HomeView expertises={adaptExpertises(expertises)} stats={adaptStats(stats)} />
}
