/**
 * Resolves a static asset path.
 *
 * With the R2 bucket URL configured (`cloudflare-r2` in .env, re-exported as
 * NEXT_PUBLIC_R2_URL by next.config.ts) paths resolve to the bucket. Without it
 * they stay relative, so local development still serves them from /public.
 */
const base = (process.env.NEXT_PUBLIC_R2_URL ?? '').replace(/\/$/, '')

export const asset = (path: string): string => {
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalised}`
}
