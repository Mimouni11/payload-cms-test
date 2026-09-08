'use client'

import React, { useState } from 'react'

import { ProjectCard } from './Card'
import { ALL_PROJECTS_LABEL, PROJECT_CATEGORIES } from './categories'
import type { ProjectCardData } from './types'

/**
 * The /projets grid and its category filter.
 *
 * Client-side on purpose. The page is `force-static`, so every card is
 * prerendered into the HTML at build time and this only hides and shows what is
 * already there — no request, no query string, no re-render on the server. With
 * JavaScript off the filter row simply does nothing and every project still
 * shows, which is the right way round.
 *
 * Filtering in the URL (`/projets?categorie=…`) would make each filter
 * shareable and indexable, but it also makes the route dynamic. Left alone
 * deliberately; revisit with the SEO work.
 */
export const FilterableGrid: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  // `null` is "Tous les projets" rather than a sentinel string, so it cannot
  // collide with a real category slug.
  const [active, setActive] = useState<string | null>(null)

  // Every category from the design shows, whether or not anything is tagged with
  // it yet. The row is part of the page's furniture — hiding pills would make it
  // reflow as the client tags projects, and an empty category is information too.
  const visible = active ? items.filter((item) => item.category === active) : items

  return (
    <>
      <div
        role="group"
        aria-label="Filtrer les réalisations par catégorie"
        className="mb-[clamp(32px,4vw,52px)] flex flex-wrap gap-3"
      >
        {[{ value: null, label: ALL_PROJECTS_LABEL }, ...PROJECT_CATEGORIES].map(
          ({ value, label }) => {
            const isActive = value === active

            return (
              <button
                type="button"
                key={value ?? 'all'}
                onClick={() => setActive(value)}
                aria-pressed={isActive}
                className={`rounded-md px-5 py-3 text-[14px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'border border-navy/20 text-navy hover:border-navy/45'
                }`}
              >
                {label}
              </button>
            )
          },
        )}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-x-[clamp(24px,3vw,44px)] gap-y-[clamp(40px,5vw,72px)] md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard
              key={project.href + project.title}
              project={project}
              variant="index"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 31vw"
            />
          ))}
        </div>
      ) : (
        // Every category is now clickable, so an empty one has to say something
        // rather than collapse the page to nothing.
        <p className="py-10 text-[15px] text-ink/60" role="status">
          Aucune réalisation dans cette catégorie pour le moment.
        </p>
      )}
    </>
  )
}
