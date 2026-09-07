// Deliberately does not re-export ./config — that is the Payload global, which
// pulls in the revalidation hook and therefore next/cache.
export { Footer } from './Component'
export { adaptFooter } from './adapt'
export type { FooterProps, SocialPlatform, FooterLink } from './types'
