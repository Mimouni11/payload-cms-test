import { Fraunces, Inter } from 'next/font/google'
import React from 'react'

import './styles.css'

// Fraunces is variable — omitting `weight` keeps the full range, and `opsz`
// lets the browser pick the display cut at large sizes.
const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  description:
    'De la conception à la livraison clé en main, Groupe BigArt orchestre chaque détail de vos espaces professionnels.',
  title: 'BigArt Group — L’art de réinventer vos espaces professionnels',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
