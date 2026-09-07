import { asset } from '@/utilities/asset'

import type { NewsProps } from './types'

/**
 * Mock content, transcribed from the design. "LIRE" goes nowhere by design —
 * article pages do not exist yet.
 *
 * Same shape a collection would produce, so wiring this to Payload later is a
 * change in the page rather than in the component.
 */
export const newsPlaceholder: NewsProps = {
  badge: 'Actualités',
  headingLines: ['Tendances, expertises,', 'nouveautés.'],
  cta: { label: 'Voir toutes les actualités', href: '#' },
  items: [
    {
      title: 'La Signalétique Corporate : Un Outil Essentiel pour l’Image de l’Entreprise',
      category: 'Signalétique',
      date: 'Juil 2025',
      href: '#',
      image: { src: asset('/blog1.webp'), alt: 'Cartes de visite et supports imprimés' },
    },
    {
      title: 'Creative Rooms : Repenser l’Aménagement pour Libérer la Créativité',
      category: 'Signalétique',
      date: 'Juil 2025',
      href: '#',
      image: { src: asset('/blog2.webp'), alt: 'Poste de travail avec double écran' },
    },
    {
      title: 'Aménagement d’espace professionnel : placez les besoins humains au cœur',
      category: 'Signalétique',
      date: 'Juil 2025',
      href: '#',
      image: { src: asset('/blog3.webp'), alt: 'Illustration isométrique d’un espace de travail' },
    },
  ],
}
