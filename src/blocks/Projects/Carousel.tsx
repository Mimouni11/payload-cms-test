'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import type { ProjectCardData } from './types'

const PER_PAGE = 2

const Corner: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="flex-none -scale-x-100">
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

const Card: React.FC<{ project: ProjectCardData }> = ({ project }) => (
  <article className="flex flex-col">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
      <Image
        className="object-cover"
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 46vw"
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

/**
 * Two projects per page, as the design shows — the dots step a page at a time,
 * swapping both cards rather than sliding by one.
 */
export const Carousel: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(items.length / PER_PAGE)
  const visible = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div>
      <div
        // Keyed on the page so the fade replays when both cards swap.
        key={page}
        className="grid animate-[fade_350ms_ease-out] gap-[clamp(24px,3vw,44px)] md:grid-cols-2"
      >
        {visible.map((project) => (
          <Card key={project.href + project.title} project={project} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-10 flex justify-center gap-[10px]">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1} sur ${pageCount}`}
              aria-current={i === page}
              className={`size-1.5 rounded-full bg-accent transition-opacity duration-300 ${
                i === page ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
