'use client'

import { isLivePreviewEvent, mergeData, ready } from '@payloadcms/live-preview'
import { useEffect, useRef, useState } from 'react'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * The admin emits a message per field change, and each one would otherwise cost a
 * `mergeData` round-trip to the server. Coalescing a burst into one call keeps
 * preview responsive without hammering the API — and only the last message in a
 * burst matters, since each carries the complete form state.
 */
const DEBOUNCE_MS = 200

/**
 * Subscribes to Payload's live-preview channel for a single global.
 *
 * Not `useLivePreview` from @payloadcms/live-preview-react: that hook keeps its
 * merged document in a module-level singleton, so two of them on one page
 * overwrite each other's data. This page previews two globals at once, so each
 * needs its own cache and a filter on `globalSlug`.
 *
 * `mergeData` is not optional. The message carries admin *form state*, not a
 * document — nested arrays arrive in a shape the render code cannot use. It POSTs
 * that state back to Payload and returns a real document, with uploads populated
 * to the requested depth.
 */
export const useGlobalPreview = <T,>(globalSlug: string, initial: T, depth: number): T => {
  const [doc, setDoc] = useState<T>(initial)
  const previous = useRef<T>(initial)

  useEffect(() => {
    // Only inside the admin's preview iframe or popup — never on a normal page load.
    const inPreviewFrame = window.parent !== window || Boolean(window.opener)
    if (!inPreviewFrame) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let latest: unknown

    const flush = async () => {
      const incomingData = latest
      if (!incomingData) return

      const merged = await mergeData<Record<string, unknown>>({
        depth,
        globalSlug,
        incomingData: incomingData as Record<string, unknown>,
        initialData: previous.current as Record<string, unknown>,
        serverURL: SERVER_URL,
      })

      if (cancelled) return
      previous.current = merged as T
      setDoc(merged as T)
    }

    const onMessage = (event: MessageEvent) => {
      if (!isLivePreviewEvent(event, SERVER_URL)) return
      if (event.data?.globalSlug !== globalSlug) return

      // Each message carries the full form state, so only the last one matters.
      latest = event.data.data
      clearTimeout(timer)
      timer = setTimeout(() => void flush(), DEBOUNCE_MS)
    }

    window.addEventListener('message', onMessage)
    // Tells the admin this frame is listening, so it starts broadcasting.
    ready({ serverURL: SERVER_URL })

    return () => {
      cancelled = true
      clearTimeout(timer)
      window.removeEventListener('message', onMessage)
    }
  }, [globalSlug, depth])

  return doc
}
