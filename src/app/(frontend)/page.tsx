import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import './styles.css'

// Read fresh from the database on every request. Swap to static rendering plus
// revalidation hooks once the content model settles.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  // `draft` is true only inside the admin preview — see next/preview/route.ts.
  // Pass it to any find/findGlobal call that should show unpublished content.
  const { isEnabled: draft } = await draftMode()

  const { totalDocs: users } = await payload.count({ collection: 'users' })

  return (
    <div className="shell">
      <h1>Payload is running</h1>
      <p>
        {users} user{users === 1 ? '' : 's'} · draft mode {draft ? 'on' : 'off'}
      </p>
      <p className="muted">
        Define collections in <code>src/collections/</code> and globals in{' '}
        <code>src/globals/</code>, register them in <code>src/payload.config.ts</code>, then run{' '}
        <code>pnpm generate:types</code>.
      </p>
      <a className="btn" href="/admin">
        Open the admin panel
      </a>
    </div>
  )
}
