/**
 * The filter row on /projets.
 *
 * One source of truth, imported by two places that must not drift: the `category`
 * select on the Projects collection (which validates what gets stored) and the
 * filter pills (which have to label those stored values back).
 *
 * Values are slugs, not labels — the database keeps the slug, so the wording can
 * be corrected later without a data migration. See docs/content-architecture.md:
 * "the database holds the single word".
 *
 * This file holds only the constant. It must stay free of Payload imports,
 * because a client component reads it — a barrel that pulled in collection
 * config would drag `next/cache` into the browser bundle and fail the build.
 *
 * Fixed for now. Letting the client add categories is backlog item 19.
 */
export type ProjectCategory = {
  value: string
  label: string
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { value: 'multinationales', label: 'Multinationales' },
  { value: 'banques-assurances', label: 'Banques & Assurances' },
  { value: 'industrie', label: 'Industrie' },
  { value: 'sante', label: 'Santé' },
]

/** Label for the pill that clears the filter. */
export const ALL_PROJECTS_LABEL = 'Tous les projets'
