import React from 'react'

import { FilterableGrid } from './FilterableGrid'
import type { ProjectCardData } from './types'

/**
 * Every project, on the /projets index. The homepage shows a carousel of
 * featured ones; this shows the lot.
 *
 * Stays a server component — the section chrome is static HTML, and only the
 * filter row and grid below it hydrate.
 */
export const ProjectsGrid: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <section className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-ink">
      {/* The hero already owns the h1, so the section title is an h2. Sized from
          the design frame — ~72px at 1440. */}
      <header className="mb-[clamp(32px,4vw,52px)]">
        <p className="mb-7 inline-flex items-center gap-2 rounded-md border border-accent/30 px-3 py-2 text-[13px] font-medium text-accent">
          <span aria-hidden="true" className="inline-block size-2.5 bg-accent" />
          Nos réalisations
        </p>
        <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.05] font-bold text-navy">
          Nos Projets
        </h2>
      </header>

      <FilterableGrid items={items} />
    </section>
  )
}
