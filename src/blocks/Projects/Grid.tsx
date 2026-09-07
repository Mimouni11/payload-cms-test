import React from 'react'

import { ProjectCard } from './Card'
import type { ProjectCardData } from './types'

/**
 * Every project, on the /projets index. The homepage shows a carousel of
 * featured ones; this shows the lot.
 */
export const ProjectsGrid: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <section className="bg-cream px-gutter py-[clamp(56px,7vw,96px)] text-ink">
      <div className="grid gap-x-[clamp(24px,3vw,44px)] gap-y-[clamp(40px,5vw,72px)] md:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <ProjectCard
            key={project.href + project.title}
            project={project}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 31vw"
          />
        ))}
      </div>
    </section>
  )
}
