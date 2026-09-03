import Image from 'next/image'
import React from 'react'

import type { NavbarProps } from './types'

export const Navbar: React.FC<NavbarProps> = ({ brand, links, cta }) => {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex h-[86px] items-center gap-8 px-gutter text-white max-nav:justify-between">
      <a className="flex flex-none items-center" href={brand.href}>
        <Image
          className="h-auto w-[clamp(76px,7vw,96px)]"
          src={brand.src}
          alt={brand.alt}
          width={brand.width}
          height={brand.height}
          priority
        />
      </a>

      <nav className="mx-auto flex items-center gap-[clamp(14px,2.2vw,30px)] max-nav:hidden">
        {links.map((link) => (
          <a
            className="text-sm font-medium text-white/75 transition-colors hover:text-white"
            href={link.href}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-70"
        href={cta.href}
      >
        {cta.label}
        <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
          <path
            d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </header>
  )
}
