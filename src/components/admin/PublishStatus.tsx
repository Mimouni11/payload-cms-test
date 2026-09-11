'use client'

import { useTranslation } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  /** Global slug to watch, e.g. "expertises". */
  globalSlug?: string
}

type Phase = 'checking' | 'live' | 'publishing' | 'slow' | 'error'

type Lang = 'fr' | 'en'

const POLL_MS = 2000
const GIVE_UP_MS = 60000

// Custom components don't get Payload's { fr, en } label handling, so this picks
// its own half from the language the user chose on their account page.
const LABEL: Record<Phase, Record<Lang, string>> = {
  checking: { fr: 'Vérification…', en: 'Checking…' },
  live: { fr: 'Site à jour', en: 'Site up to date' },
  publishing: { fr: 'Publication en cours…', en: 'Publishing…' },
  slow: {
    fr: 'Toujours en cours — actualisez dans un instant',
    en: 'Still going — refresh in a moment',
  },
  error: { fr: 'Statut indisponible', en: 'Status unavailable' },
}

const VIEW_SITE: Record<Lang, string> = { fr: 'Voir le site', en: 'View the site' }

const COLOUR: Record<Phase, string> = {
  checking: '#8d99ae',
  live: '#2e7d32',
  publishing: '#b26a00',
  slow: '#b26a00',
  error: '#8d99ae',
}

/**
 * Tells the editor whether the public site is actually serving their latest
 * publish.
 *
 * The public route is statically rendered, so a publish takes effect on
 * revalidation rather than on the next request. Without this an editor publishes,
 * opens the site, sees the old content and concludes the CMS is broken.
 *
 * It works by comparing two numbers: what the database holds (Payload's REST API)
 * against what the static site is serving (/next/content-version, which is itself
 * static and revalidated by the same hook). Polling Payload alone would report
 * success the instant the write landed, which is precisely the lie this exists to
 * prevent.
 *
 * Stateless by design — status is derived from that comparison on every tick
 * rather than from observing the publish action, so it cannot get wedged if an
 * event is missed, and it is not coupled to PublishButton's internals.
 */
export const PublishStatus: React.FC<Props> = ({ globalSlug }) => {
  const { i18n } = useTranslation()
  const lang: Lang = i18n.language === 'en' ? 'en' : 'fr'
  const [phase, setPhase] = useState<Phase>('checking')
  const pendingSince = useRef<number | null>(null)

  const check = useCallback(async (): Promise<void> => {
    if (!globalSlug) return

    try {
      const [liveRes, servedRes] = await Promise.all([
        fetch(`/api/globals/${globalSlug}?depth=0`, { cache: 'no-store', credentials: 'include' }),
        fetch('/next/content-version', { cache: 'no-store' }),
      ])

      if (!liveRes.ok || !servedRes.ok) {
        setPhase('error')
        return
      }

      const live = (await liveRes.json()) as { _status?: string; updatedAt?: string }
      const served = (await servedRes.json()) as { updatedAt?: string | null }

      // Unpublished edits are not meant to be on the public site at all.
      if (live._status !== 'published') {
        pendingSince.current = null
        setPhase('live')
        return
      }

      const isServed = Boolean(
        live.updatedAt && served.updatedAt && served.updatedAt >= live.updatedAt,
      )

      if (isServed) {
        pendingSince.current = null
        setPhase('live')
        return
      }

      pendingSince.current ??= Date.now()
      setPhase(Date.now() - pendingSince.current > GIVE_UP_MS ? 'slow' : 'publishing')
    } catch {
      setPhase('error')
    }
  }, [globalSlug])

  useEffect(() => {
    void check()

    // Poll while a publish is propagating; idle back to a slow heartbeat once live.
    const id = setInterval(() => void check(), phase === 'live' ? POLL_MS * 5 : POLL_MS)

    return () => clearInterval(id)
  }, [check, phase])

  return (
    <div
      aria-live="polite"
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        fontSize: '0.8rem',
        gap: '0.5rem',
        marginRight: '0.75rem',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: COLOUR[phase],
          borderRadius: '50%',
          display: 'inline-block',
          height: 8,
          width: 8,
        }}
      />
      <span>{LABEL[phase][lang]}</span>
      {phase === 'live' && (
        <a href="/" rel="noreferrer" style={{ textDecoration: 'underline' }} target="_blank">
          {VIEW_SITE[lang]}
        </a>
      )}
    </div>
  )
}

export default PublishStatus
