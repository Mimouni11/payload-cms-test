import React from 'react'

import { Form } from './Form'
import type { ContactDetail, ContactProps } from './types'

const ICONS: Record<ContactDetail['icon'], React.ReactNode> = {
  location: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a1.5 1.5 0 01-1.7 1.5A17 17 0 015 5.2 1.5 1.5 0 016.5 3.5z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 5.5L20 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
}

/** The submit button sits outside the <form>, so it needs this to reach it. */
const FORM_ID = 'contact-form'

const Icon: React.FC<{ name: ContactDetail['icon'] }> = ({ name }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="mt-px flex-none text-[#E5E5E5]/50"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name]}
  </svg>
)

/**
 * Real map of the office.
 *
 * The address string is passed as the query and geocoded by the provider, so no
 * coordinates are hard-coded — change the address in the placeholder (or later,
 * the CMS) and the pin follows. OpenStreetMap's embed was the first choice since
 * it needs no key and sets no cookies, but it takes a bounding box rather than a
 * query, which would have meant typing in coordinates by hand.
 *
 * The design's map is dark and this provider's tiles are light, so the frame is
 * inverted and hue-rotated back — the standard way to darken raster tiles
 * without a styling API. Labels end up slightly grey; that is the trade.
 *
 * Note: this embed sets third-party cookies. If that matters for the contact
 * page, swap it for a static map image or a click-to-load placeholder.
 */
const MapPanel: React.FC<{ query: string; label: string }> = ({ query, label }) => {
  const search = encodeURIComponent(query)

  return (
    <a
      className="group relative block aspect-[364/200] w-full overflow-hidden rounded"
      href={`https://www.google.com/maps/search/?api=1&query=${search}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <iframe
        className="pointer-events-none size-full border-0 [filter:invert(1)_hue-rotate(180deg)_brightness(0.94)_contrast(1.04)]"
        src={`https://www.google.com/maps?q=${search}&z=14&output=embed`}
        title={label}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <span className="absolute inset-0 ring-1 ring-white/10 transition-colors group-hover:ring-white/25" />
    </a>
  )
}

/**
 * "Envoyer un message" — contact form on the left, practical details on the right.
 *
 * Server component; only the form's chip state is client-side.
 */
export const Contact: React.FC<ContactProps> = ({
  headingLines,
  map,
  fields,
  servicesLabel,
  services,
  submitLabel,
  details,
}) => (
  <section
    id="contact"
    className="lattice lattice--contact relative overflow-hidden bg-ink px-gutter py-[clamp(56px,7vw,96px)] text-[#E5E5E5]"
  >
    <div className="relative grid gap-[clamp(40px,5vw,72px)] lg:grid-cols-[minmax(0,826fr)_minmax(0,364fr)]">
      <div>
        <h2 className="mb-[clamp(32px,4vw,56px)] text-[clamp(2.4rem,6.6vw,6rem)] leading-[0.82] font-bold tracking-[-0.015em]">
          {headingLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <Form
          formId={FORM_ID}
          fields={fields}
          servicesLabel={servicesLabel}
          services={services}
        />
      </div>

      <div className="flex flex-col gap-6">
        <MapPanel query={map.query} label={map.label} />

        {details.map((detail) => (
          <div key={detail.label}>
            <h3 className="mb-2 font-serif text-[24px] leading-[1.1] font-semibold text-[#E5E5E5]">
              {detail.label}
            </h3>
            <p className="flex items-start gap-2 text-[16px] leading-[1.1] font-medium text-[#E5E5E5]">
              <Icon name={detail.icon} />
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Aligned to the section, not the form. In the design it sits at left:1146
        of a 1440 frame — beneath the details column rather than at the right
        edge of the form block. Reaches the form by id. */}
    <div className="relative mt-[clamp(28px,4vw,56px)] flex md:justify-end">
      <button
        type="submit"
        form={FORM_ID}
        className="h-11 w-full rounded-md bg-accent px-6 text-[14px] font-semibold text-[#E5E5E5] transition hover:-translate-y-0.5 md:w-[240px]"
      >
        {submitLabel}
      </button>
    </div>
  </section>
)
