import { getPayload } from 'payload'

import config from '@/payload.config'

/**
 * Reports the content version the *public site* is currently serving.
 *
 * Statically rendered and revalidated by the same hook as `/`, so it regenerates
 * when the homepage does. That is the entire point: polling Payload's own API
 * would report a publish as complete the moment the database write landed, before
 * the static page had actually rebuilt — telling the editor it was live while
 * visitors still saw the old version.
 *
 * Lives under /next/* rather than /api/*, which Payload owns via
 * (payload)/api/[...slug].
 */
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config: await config })

  const [expertises, stats] = await Promise.all([
    payload.findGlobal({ slug: 'expertises', depth: 0 }),
    payload.findGlobal({ slug: 'stats', depth: 0 }),
  ])

  const timestamps = [expertises?.updatedAt, stats?.updatedAt].filter(
    (value): value is string => typeof value === 'string',
  )

  const updatedAt = timestamps.sort().at(-1) ?? null

  return Response.json({ updatedAt })
}
