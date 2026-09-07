// Deliberately does not re-export `../../collections/Projects` — that is the
// Payload config, which pulls in the revalidation hook and therefore next/cache.
export { Projects } from './Component'
export { ProjectCard } from './Card'
export { ProjectsGrid } from './Grid'
export { adaptProjects } from './adapt'
export type { ProjectsProps, ProjectCardData } from './types'
