'use client'

import React, { useEffect, useRef, useState } from 'react'
import { isLivePreviewEvent, mergeData, ready } from '@payloadcms/live-preview'

import type { Header } from '@/payload-types'

type NavItem = NonNullable<Header['navItems']>[number]

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * A direct live-preview subscription instead of `useLivePreview`.
 *
 * The official hook keeps its merged document in a module-level cache, so two
 * hooks on one page overwrite each other's data. Here we listen to the same
 * postMessage channel, ignore anything that isn't the `header` global, and
 * keep our own cache — which lets the hero and the navbar preview at once.
 *
 * `mergeData` is not optional: the message carries admin *form state*, not a
 * document, so nested arrays arrive in a shape the render code cannot use.
 * It posts that state to Payload and returns a real document back.
 */
const useHeaderPreview = (initial: Header): Header => {
  const [data, setData] = useState<Header>(initial)
  const previous = useRef<Header>(initial)

  useEffect(() => {
    // Only inside the admin's preview iframe/popup — never on the public site.
    const inPreviewFrame = window.parent !== window || Boolean(window.opener)
    if (!inPreviewFrame) return

    let cancelled = false

    const onMessage = async (event: MessageEvent) => {
      if (!isLivePreviewEvent(event, SERVER_URL)) return
      if (event.data?.globalSlug !== 'header') return

      const merged = await mergeData<Header>({
        depth: 1,
        globalSlug: 'header',
        incomingData: event.data.data,
        initialData: previous.current,
        serverURL: SERVER_URL,
      })

      if (cancelled) return
      previous.current = merged
      setData(merged)
    }

    window.addEventListener('message', onMessage)
    ready({ serverURL: SERVER_URL })

    return () => {
      cancelled = true
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return data
}

export const Navbar: React.FC<{ data: Header }> = ({ data: initialData }) => {
  const data = useHeaderPreview(initialData)

  // Index of the open dropdown, or null. Only one can be open at a time.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openIndex === null) return

    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpenIndex(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openIndex])

  // Hidden rows stay in the database — they just never reach the markup.
  // Array.isArray rather than `?? []`: this data arrives over postMessage
  // mid-edit, so a field can briefly be something other than an array.
  const items = Array.isArray(data.navItems)
    ? data.navItems.filter((item) => item?.enabled !== false)
    : []

  const visibleEntries = (item: NavItem) =>
    Array.isArray(item?.dropdown)
      ? item.dropdown.filter((entry) => entry?.enabled !== false)
      : []

  return (
    <header className="nav">
      <a className="nav__brand" href="/">
        <span className="nav__mark" aria-hidden="true" />
        {data.brand}
      </a>

      <nav className="nav__links" ref={wrapRef}>
        {items.map((item, i) => {
          const entries = visibleEntries(item)

          // No visible dropdown entries left? Render it as an ordinary link.
          if (entries.length === 0) {
            return (
              <a className="nav__link" href={item.href || '#'} key={item.id ?? i}>
                {item.label}
              </a>
            )
          }

          const isOpen = openIndex === i

          return (
            <div className="nav__item" key={item.id ?? i}>
              <button
                type="button"
                className="nav__trigger"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.label}
                <svg
                  className={`nav__chev ${isOpen ? 'is-open' : ''}`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  aria-hidden="true"
                >
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>

              {isOpen && (
                <div className="dropdown">
                  {entries.map((entry, j) => (
                    <a
                      className="dropdown__row"
                      href={entry.href || '#'}
                      key={entry.id ?? j}
                      onClick={() => setOpenIndex(null)}
                    >
                      <span className="dropdown__label">{entry.label}</span>
                      {entry.blurb && <span className="dropdown__blurb">{entry.blurb}</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {data.ctaEnabled !== false && data.ctaLabel && (
        <a className="nav__cta" href={data.ctaHref || '#'}>
          {data.ctaLabel}
        </a>
      )}
    </header>
  )
}
