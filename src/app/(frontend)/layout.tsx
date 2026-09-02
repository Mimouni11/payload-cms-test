import React from 'react'

import './styles.css'

export const metadata = {
  description: 'Payload + Next.js starting point.',
  title: 'Site',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
