import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export const metadata = {
  description: 'Small-group, slow-paced journeys designed around one place at a time.',
  title: 'Meridian — The world, unhurried',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const payload = await getPayload({ config: await config })
  const { isEnabled: draft } = await draftMode()
  const settings = await payload.findGlobal({ slug: 'settings', draft })

  // Every colour in styles.css resolves from tokens scoped to this attribute,
  // so one word here recolours the whole site.
  return (
    <html lang="en" data-theme={settings.theme ?? 'meridian'}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
