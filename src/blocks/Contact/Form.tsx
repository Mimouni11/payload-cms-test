'use client'

import React, { useState } from 'react'

import type { ContactProps } from './types'

type Props = Pick<ContactProps, 'fields' | 'servicesLabel' | 'services'> & {
  /** The submit button lives outside this form — see FORM_ID in Component.tsx. */
  formId: string
}

/**
 * The only interactive part of the section: the service chips toggle.
 *
 * Nothing is submitted anywhere — there is no endpoint and no form-builder
 * plugin installed. `onSubmit` is intercepted so the browser does not navigate,
 * which would look like a broken page rather than an unfinished feature.
 */
export const Form: React.FC<Props> = ({ fields, servicesLabel, services, formId }) => {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (service: string) =>
    setSelected((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service],
    )

  const row = 'flex flex-col gap-2 border-b border-ink/10 py-5 md:flex-row md:items-center md:gap-8'
  const label = 'w-[130px] shrink-0 text-[14px] font-normal text-ink'
  const input =
    'w-full bg-transparent text-[clamp(1.25rem,2.2vw,2rem)] font-semibold text-ink outline-none placeholder:text-ink/40'

  // The asterisk is for sighted users; the `required` attribute on the input is
  // what screen readers announce, so the mark itself is hidden from them.
  const requiredMark = <span aria-hidden="true">*</span>

  return (
    <form
      id={formId}
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className={row}>
        <label className={label} htmlFor="contact-name">
          {fields.name.label}
          {requiredMark}
        </label>
        <input
          className={input}
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder={fields.name.placeholder}
        />
      </div>

      <div className={row}>
        <label className={label} htmlFor="contact-company">
          {fields.company.label}
          {requiredMark}
        </label>
        <input
          className={input}
          id="contact-company"
          name="company"
          type="text"
          required
          placeholder={fields.company.placeholder}
        />
      </div>

      <div className={row}>
        <label className={label} htmlFor="contact-email">
          {fields.email.label}
          {requiredMark}
        </label>
        <input
          className={input}
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={fields.email.placeholder}
        />
      </div>

      <div className={`${row} md:items-start`}>
        <label className={`${label} md:pt-2`} htmlFor="contact-message">
          {fields.message.label}
        </label>
        <textarea
          className={`${input} resize-none leading-[1.22]`}
          id="contact-message"
          name="message"
          rows={3}
          placeholder={fields.message.placeholder}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="mb-5 text-[12px] font-normal tracking-[1.95px] text-ink">
          {servicesLabel}
        </legend>

        <div className="flex flex-wrap gap-2">
          {services.map((service) => {
            const active = selected.includes(service)

            return (
              <button
                type="button"
                key={service}
                onClick={() => toggle(service)}
                aria-pressed={active}
                className={`h-10 rounded-md border px-4 text-[12px] font-medium transition-colors ${
                  active
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-ink/15 bg-white/50 text-ink/85 hover:border-ink/35'
                }`}
              >
                {service}
              </button>
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
