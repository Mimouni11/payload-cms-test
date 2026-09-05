// Deliberately does not re-export `./config`. That is the Payload global, which
// pulls in the revalidation hook and therefore `next/cache` — importing it from a
// client component breaks the build. payload.config.ts imports it by path, as it
// does for Expertises.
export { Stats } from './Component'
export { statsPlaceholder } from './placeholder'
export { adaptStats } from './adapt'
export type { StatsProps, Stat } from './types'
