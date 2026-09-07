import Image from 'next/image'
import React from 'react'

import type { ProjectCardData } from './types'

const Corner: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="flex-none -scale-x-100"
  >
    <path
      d="M4 4v5a4 4 0 004 4h12M15 9l5 4-5 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * One project card. Shared by the homepage carousel and the /projets grid so the
 * two cannot drift — the carousel had its own copy until the index page needed
 * the same markup.
 *
 * Server component: nothing here is interactive.
 */
export const ProjectCard: React.FC<{ project: ProjectCardData; sizes?: string }> = ({
  project,
  sizes = '(max-width: 768px) 100vw, 46vw',
}) => (
  <article className="flex flex-col">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
      <Image
        className="object-cover"
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes={sizes}
        quality={82}
      />
    </div>

    {(project.sector || project.city) && (
      <p className="mt-4 flex items-center gap-2 text-[13px] font-medium text-accent">
        <span aria-hidden="true" className="inline-block size-2.5 bg-accent" />
        {[project.sector, project.city].filter(Boolean).join('. ')}.
      </p>
    )}

    <h3 className="mt-1 font-sans text-[clamp(1.25rem,1.7vw,1.55rem)] leading-tight font-bold tracking-[-0.01em]">
      {project.title}
    </h3>

    {project.summary && (
      <p className="mt-1 max-w-[52ch] text-[15px] leading-[1.5] text-ink/80">{project.summary}</p>
    )}

    {project.tags.length > 0 && (
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            className="rounded-md bg-accent/8 px-3 py-2 text-[13px] font-medium text-accent"
            key={tag}
          >
            {tag}
          </li>
        ))}
      </ul>
    )}

    <a
      className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-accent uppercase transition-opacity hover:opacity-70"
      href={project.href}
    >
      <Corner />
      Lire
    </a>
  </article>
)
