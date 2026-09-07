import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { FooterProps, SocialPlatform } from './types'

/**
 * Icons keyed by platform. The editor picks a platform from a fixed list rather
 * than uploading an icon, so a row can never render blank or off-brand.
 */
const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  facebook: (
    <path
      d="M13.5 8.5V7.2c0-.6.4-.7.6-.7h1.5V4.4h-2.1c-2.3 0-2.8 1.7-2.8 2.8v1.3H9.2v2.2h1.5V17h2.8v-6.3h1.9l.2-2.2h-2.1z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.2" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.4" cy="7.6" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  x: (
    <path
      d="M5.5 5.2h3l3.3 4.4 3.7-4.4h1.9l-4.7 5.5 5 6.6h-3l-3.5-4.7-4 4.7H5.3l5-5.9-4.8-6.2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <>
      <path
        d="M7.3 9.8h2.2V17H7.3V9.8zm1.1-3.6a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6zM11.3 9.8h2.1v1c.3-.6 1.1-1.2 2.2-1.2 2.1 0 2.6 1.3 2.6 3.1V17h-2.2v-3.8c0-.9-.2-1.6-1.1-1.6s-1.4.6-1.4 1.5V17h-2.2V9.8z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
}

const LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
}

/** Turns an email or phone line into a usable link; anything else stays text. */
const contactHref = (line: string): string | null => {
  if (line.includes('@')) return `mailto:${line.trim()}`
  if (/^[+\d][\d\s().-]{6,}$/.test(line.trim())) return `tel:${line.replace(/[^\d+]/g, '')}`
  return null
}

const columnHeading = 'mb-6 text-[17px] font-medium text-white'
const columnLink =
  'block text-[15px] text-white/75 transition-colors hover:text-white'

export const Footer: React.FC<FooterProps> = ({
  brand,
  tagline,
  socials,
  navTitle,
  navLinks,
  servicesTitle,
  services,
  contactTitle,
  contactLines,
  legal,
}) => (
  <footer className="bg-ink px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(24px,3vw,40px)] text-white">
    <div className="grid gap-[clamp(32px,4vw,56px)] md:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
      <div>
        <Image
          className="h-auto w-[110px]"
          src={brand.src}
          alt={brand.alt}
          width={brand.width}
          height={brand.height}
        />

        {tagline && (
          <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.5] text-white/80">{tagline}</p>
        )}

        {socials.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-3">
            {socials.map((social) => (
              <li key={social.platform + social.url}>
                <a
                  className="flex size-10 items-center justify-center rounded-full border border-white/35 text-white/85 transition-colors hover:border-white hover:text-white"
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={LABELS[social.platform]}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {SOCIAL_ICONS[social.platform]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {navLinks.length > 0 && (
        <nav aria-label={navTitle}>
          <h2 className={columnHeading}>{navTitle}</h2>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                {/* next/link keeps internal navigation client-side. */}
                <Link className={columnLink} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {services.length > 0 && (
        <div>
          <h2 className={columnHeading}>{servicesTitle}</h2>
          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service.label}>
                <Link className={columnLink} href={service.href}>
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contactLines.length > 0 && (
        <div>
          <h2 className={columnHeading}>{contactTitle}</h2>
          <ul className="space-y-4">
            {contactLines.map((line) => {
              const href = contactHref(line)

              return (
                <li className="text-[15px] text-white/75" key={line}>
                  {href ? (
                    <a className="transition-colors hover:text-white" href={href}>
                      {line}
                    </a>
                  ) : (
                    line
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>

    {legal && (
      <div className="mt-[clamp(36px,5vw,64px)] border-t border-white/15 pt-6 text-center text-[15px] text-white/70">
        {legal}
      </div>
    )}
  </footer>
)
