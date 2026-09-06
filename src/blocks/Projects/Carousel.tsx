'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import type { ProjectCardData } from './types'

const AUTOPLAY_MS = 5000

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

const Card: React.FC<{ project: ProjectCardData }> = ({ project }) => (
  <article className="flex flex-col">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
      <Image
        className="object-cover"
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 46vw"
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
 * Two cards visible, sliding one at a time.
 *
 * Not paged two-at-a-time: with an odd number of projects the last page would
 * be half empty. Stepping by one means every project gets a turn on the left,
 * and the dot count follows the project count rather than the page count.
 *
 * The track holds every card and is translated by whole slide widths. Slide
 * width lives in a CSS variable so the same arithmetic works at both
 * breakpoints — one card on mobile, two from `md` up — without measuring
 * anything in JavaScript.
 */
export const Carousel: React.FC<{ items: ProjectCardData[] }> = ({ items }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Clamped to whatever the current viewport shows; the desktop case (2) is the
  // constraining one, and on mobile the last slide simply sits flush.
  const lastIndex = Math.max(0, items.length - 2)
  const current = Math.min(index, lastIndex)

  useEffect(() => {
    if (lastIndex === 0 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setIndex((i) => (i >= lastIndex ? 0 : i + 1)), AUTOPLAY_MS)

    return () => clearInterval(id)
  }, [lastIndex, paused])

  // Pause on hover only. Pausing on focus as well looked identical but broke it:
  // clicking a dot focuses that button, focus then stays there, and autoplay
  // never resumed.
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden">
        <div
          className="flex [--slide:100%] transition-transform duration-500 ease-out md:[--slide:50%]"
          style={{
            transform: 'translateX(calc(var(--i) * -1 * var(--slide)))',
            ['--i' as string]: current,
          }}
        >
          {items.map((project) => (
            <div
              className="w-[var(--slide)] shrink-0 pr-0 md:pr-[clamp(24px,3vw,44px)]"
              key={project.href + project.title}
            >
              <Card project={project} />
            </div>
          ))}
        </div>
      </div>

      {lastIndex > 0 && (
        <div className="mt-10 flex justify-center gap-[10px]">
          {Array.from({ length: lastIndex + 1 }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Réalisation ${i + 1}`}
              aria-current={i === current}
              className={`size-1.5 rounded-full bg-accent transition-opacity duration-300 ${
                i === current ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
