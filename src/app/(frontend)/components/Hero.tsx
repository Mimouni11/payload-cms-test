'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'

import type { Home } from '@/payload-types'

/**
 * Renders the hero from the `home` global.
 *
 * `useLivePreview` opens a postMessage channel to the admin panel. While the
 * editor types, Payload pushes the in-progress document straight into `data`
 * — no save, no publish, no reload. Outside the admin iframe the hook simply
 * returns `initialData`, so the public site is unaffected.
 */
export const Hero: React.FC<{ initialData: Home }> = ({ initialData }) => {
  const { data } = useLivePreview<Home>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  // Hidden by the toggle, unless the "bring it back on" date has already passed.
  const showStats =
    data.statsEnabled !== false ||
    (!!data.statsShowAgainOn && new Date(data.statsShowAgainOn) <= new Date())

  // Both designs render the same markup — only the class and the ridge differ,
  // so switching variants never loses what the editor typed.
  const editorial = data.variant === 'editorial'

  return (
    <section className={editorial ? 'hero hero--editorial' : 'hero'}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        {data.eyebrow && <p className="hero__eyebrow">{data.eyebrow}</p>}

        <h1 className="hero__title">
          {data.title} {data.titleAccent && <em>{data.titleAccent}</em>}
        </h1>

        {data.lede && <p className="hero__lede">{data.lede}</p>}

        <div className="hero__actions">
          {data.primaryCta && (
            <a className="btn btn--primary" href="#catalogue">
              {data.primaryCta}
            </a>
          )}
          {data.secondaryCta && (
            <a className="btn btn--ghost" href="#">
              {data.secondaryCta}
            </a>
          )}
        </div>

        {showStats && !!data.stats?.length && (
          <dl className="hero__stats">
            {data.stats.map((stat) => (
              <div key={stat.id ?? stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {!editorial && (
        <svg
          className="hero__ridge"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 168 L210 96 L318 141 L487 54 L654 138 L802 88 L980 150 L1145 78 L1290 132 L1440 92 L1440 220 L0 220 Z"
            opacity="0.35"
          />
          <path d="M0 196 L242 132 L430 178 L612 116 L836 176 L1042 128 L1244 180 L1440 140 L1440 220 L0 220 Z" />
        </svg>
      )}
    </section>
  )
}
