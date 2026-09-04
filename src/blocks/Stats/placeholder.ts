import type { StatsProps } from './types'

/** Transcribed from the design. Seed input only — see docs/content-architecture.md. */
export const statsPlaceholder: StatsProps = {
  items: [
    { prefix: '+', value: 18, label: 'ans d’expertise' },
    { prefix: '+', value: 1, suffix: 'k', label: 'projets livrés' },
    { prefix: '+', value: 500, label: 'clients' },
    { prefix: '+', value: 20, label: 'collaborateurs' },
    { value: 6, label: 'métiers intégrés' },
    { value: 4, label: 'exclusivités européennes' },
  ],
}
