import { getPayload } from 'payload'

import config from '@/payload.config'
import { expertisesPlaceholder } from '@/blocks/Expertises'

/**
 * One-shot seed for a fresh database.
 *
 * Moves the content in `placeholder.ts` into Payload so the database becomes the
 * single source of truth.
 *
 *   GET /next/seed?secret=<PREVIEW_SECRET>
 *
 * Three guards, in order:
 *   1. Development only — this is a write endpoint and has no business being
 *      reachable on the public site.
 *   2. Requires PREVIEW_SECRET.
 *   3. Refuses to run when the global already has rows, so it cannot duplicate
 *      content if called twice.
 *
 * To seed a remote database, point DATABASE_URL at it and run this locally.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  const secret = new URL(req.url).searchParams.get('secret')

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Unauthorised', { status: 401 })
  }

  const payload = await getPayload({ config: await config })

  const existing = await payload.findGlobal({ slug: 'expertises', depth: 0 })
  if (existing.items && existing.items.length > 0) {
    return Response.json(
      { seeded: false, reason: 'Expertises already has rows — delete them first to re-seed.' },
      { status: 409 },
    )
  }

  // The placeholder points at an absolute R2 URL. Pull the bytes and hand them
  // to Payload so the upload goes through the storage adapter like any other.
  const source = expertisesPlaceholder.items[0]?.image.src
  if (!source) return Response.json({ seeded: false, reason: 'No placeholder image' }, { status: 500 })

  const fileRes = await fetch(source)
  if (!fileRes.ok) {
    return Response.json(
      { seeded: false, reason: `Could not fetch ${source} (${fileRes.status})` },
      { status: 502 },
    )
  }

  const data = Buffer.from(await fileRes.arrayBuffer())
  const name = source.split('/').pop() ?? 'expertise.jpg'

  const media = await payload.create({
    collection: 'media',
    data: { alt: 'Bureaux cloisonnés — systèmes ABCD International' },
    file: {
      data,
      name,
      mimetype: fileRes.headers.get('content-type') ?? 'image/jpeg',
      size: data.length,
    },
  })

  await payload.updateGlobal({
    slug: 'expertises',
    data: {
      badge: expertisesPlaceholder.badge,
      headingLines: expertisesPlaceholder.headingLines.map((text) => ({ text })),
      items: expertisesPlaceholder.items.map((item) => ({
        title: item.title,
        description: item.description,
        image: media.id,
        caption: item.image.caption,
        linkLabel: item.link?.label,
        linkHref: item.link?.href,
      })),
    },
  })

  // Publish so the public site sees it, not just draft preview.
  await payload.updateGlobal({
    slug: 'expertises',
    data: { _status: 'published' },
  })

  return Response.json({
    seeded: true,
    mediaId: media.id,
    mediaUrl: media.url,
    items: expertisesPlaceholder.items.length,
  })
}
