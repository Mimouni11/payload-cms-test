import Image from 'next/image'
import React from 'react'

import type { ClientLogosProps } from './types'

/**
 * How many times the logo set is repeated to build one loop segment.
 * The segment must be wider than the viewport or a gap appears mid-scroll,
 * which is why a handful of logos still needs repeating.
 */
const REPEAT = 3

export const ClientLogos: React.FC<ClientLogosProps> = ({ items, speedSeconds = 60 }) => {
  if (items.length === 0) return null

  // One segment, then the same segment again. The animation translates exactly
  // -50%, so the second copy lands where the first began — no visible seam.
  const segment = Array.from({ length: REPEAT }, () => items).flat()
  const track = [...segment, ...segment]

  return (
    <section
      className="marquee-mask overflow-hidden bg-cream py-[46px]"
      aria-label="Ils nous font confiance"
    >
      <div
        className="marquee-track flex w-max items-center"
        style={{ ['--marquee-duration' as string]: `${speedSeconds}s` }}
      >
        {track.map((logo, i) => (
          <Image
            className="marquee-item h-11 w-auto opacity-70 grayscale"
            key={`${logo.src}-${i}`}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            // The duplicates are decorative repeats of the same brands.
            aria-hidden={i >= items.length}
          />
        ))}
      </div>
    </section>
  )
}
