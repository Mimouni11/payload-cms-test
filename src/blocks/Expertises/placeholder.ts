import type { ExpertisesProps } from './types'

/**
 * Content transcribed from the design. The one paragraph that exists is reused
 * across every expertise so each row is functional when clicked — real copy
 * replaces it per item once it is written.
 */
const description =
  'Systèmes démontables, vitrés ou pleins, testés acoustiquement. Distributeur exclusif ABCD International en Tunisie depuis 2008.'

const item = (title: string) => ({
  title,
  description,
  link: { label: 'Découvrir', href: '#' },
  image: {
    src: '/nos-expertise.png',
    alt: title,
    caption: 'Systèmes ABCD International',
  },
})

export const expertisesPlaceholder: ExpertisesProps = {
  badge: 'Nos métiers',
  headingLines: ['Six expertises.', 'Une seule équipe.'],
  items: [
    item('Cloisonnement'),
    item('Signalétique'),
    item('Traitement du vitrage'),
    item('Habillage de surface'),
    item('Agencement sur mesure'),
  ],
}
