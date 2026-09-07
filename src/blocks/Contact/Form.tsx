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

  const row = 'flex flex-col gap-2 border-b border-white/10 py-5 md:flex-row md:items-center md:gap-8'
  const label = 'w-[130px] shrink-0 text-[14px] font-normal text-[#E4E4E4]'
  const input =
    'w-full bg-transparent text-[clamp(1.25rem,2.2vw,2rem)] font-semibold text-[#E5E5E5] outline-none placeholder:text-[#E5E5E5]/25'

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
        </label>
        <input
          className={input}
          id="contact-name"
          name="name"
          type="text"
          placeholder={fields.name.placeholder}
        />
      </div>

      <div className={row}>
        <label className={label} htmlFor="contact-company">
          {fields.company.label}
        </label>
        <input
          className={input}
          id="contact-company"
          name="company"
          type="text"
          placeholder={fields.company.placeholder}
        />
      </div>

      <div className={row}>
        <label className={label} htmlFor="contact-email">
          {fields.email.label}
        </label>
        <input
          className={input}
          id="contact-email"
          name="email"
          type="email"
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
        <legend className="mb-5 text-[12px] font-normal tracking-[1.95px] text-[#E4E4E4]">
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
                className={`h-10 rounded-md px-4 text-[12px] font-medium transition-colors ${
                  active
                    ? 'bg-accent text-white'
                    : 'bg-[#E5E5E5]/16 text-[#E5E5E5]/90 hover:bg-[#E5E5E5]/24'
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
