import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/**
 * Turns on Next's draft mode so the site renders unpublished content.
 * The admin panel's live-preview iframe points here.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const secret = req.nextUrl.searchParams.get('secret')
  const path = req.nextUrl.searchParams.get('path') || '/'

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // Only ever redirect to a relative path — an open redirect here would be a real hole.
  if (!path.startsWith('/')) {
    return new Response('Invalid path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
