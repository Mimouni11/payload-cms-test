import { asset } from '@/utilities/asset'

import type { HeroProps } from './types'

/**
 * Stand-in content until the Hero global is wired.
 * Reusable afterwards as seed data — see docs/content-architecture.md.
 */
export const heroPlaceholder: HeroProps = {
  badge: 'Plusieurs solutions, Une même adresse.',
  title: 'L’art de réinventer vos espaces professionnels.',
  lede: 'De la conception à la livraison clé en main, Groupe BigArt orchestre chaque détail pour créer des environnements qui reflètent qui vous êtes. Depuis 2008.',
  cta: { label: 'Découvrir nos réalisations', href: '#projets' },
  image: {
    src: asset('/hero-bg.jpg'),
    alt: 'Salon professionnel aménagé avec un canapé en cuir orange devant un mur sombre à lattes verticales',
  },
}
