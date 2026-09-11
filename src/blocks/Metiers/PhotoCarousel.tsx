'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import type { MetierPhoto } from './types'

/**
 * The photo side of a métier row: one image at a time, a caption bar across the
 * bottom, and dots to step through.
 *
 * Every photo is rendered and stacked, with opacity switching between them,
 * rather than swapping a single `src`. That keeps all of them in the prerendered
 * HTML — they are real content, and a crawler should see them — and it means
 * stepping through has no flash while the next file loads.
 *
 * No autoplay. The homepage carousel advances on its own because it is a teaser;
 * this one sits beside the copy describing it, and moving under the reader is
 * the wrong behaviour.
 */
export const PhotoCarousel: React.FC<{ photos: MetierPhoto[]; priority?: boolean }> = ({
  photos,
  priority = false,
}) => {
  const [index, setIndex] = useState(0)
  const current = photos[Math.min(index, photos.length - 1)]

  return (
    <div className="relative aspect-[798/670] w-full overflow-hidden rounded">
      {photos.map((photo, i) => (
        <Image
          key={photo.src + i}
          className={`object-cover transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 56vw"
          quality={82}
          priority={priority && i === 0}
        />
      ))}

      {/* Flat 20% black so the caption bar stays legible on a bright photo. */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="absolute inset-x-[clamp(12px,3%,28px)] bottom-[clamp(12px,4%,32px)] flex flex-col items-center gap-4">
        {current?.caption && (
          <p className="flex w-full items-center justify-center rounded bg-[rgba(229,229,229,0.05)] px-4 py-3 text-center font-serif text-[clamp(0.9rem,1.4vw,1.25rem)] leading-[1.1] font-semibold text-[#e5e5e5] shadow-[0_0_1px_rgba(0,0,0,0.32)] backdrop-blur-[2px]">
            {current.caption}
          </p>
        )}

        {photos.length > 1 && (
          <div className="flex items-center gap-[10px]">
            {photos.map((photo, i) => (
              <button
                type="button"
                key={photo.src + i}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1} sur ${photos.length}`}
                aria-current={i === index}
                className={`size-1.5 rounded-full bg-[#e5e5e5] transition-opacity duration-300 ${
                  i === index ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
