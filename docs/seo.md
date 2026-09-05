# SEO

Payload itself is SEO-neutral. It is a data layer and never touches the markup — unlike a
themed CMS, nothing is injected that you did not write. Everything that affects ranking is
decided in the Next.js frontend.

So this document is not about Payload settings. It is about the decisions around it, and
the ones this project has not made yet.

---

## Status

| Item | State |
|---|---|
| Server-rendered HTML | ✅ crawlable without JS |
| `alt` required on Media | ✅ enforced at the schema level |
| Semantic markup | ✅ real headings, `dl`/`dt`/`dd` for figures |
| Rendering strategy | ❌ `force-dynamic` — DB query per request |
| Generated image sizes | ❌ Media stores whatever is uploaded |
| Per-page metadata | ❌ one static export in the frontend layout |
| Sitemap / robots.txt | ❌ neither exists |

---

## 1. Rendering strategy — highest impact

> Decided. See **`docs/rendering.md`** for the chosen approach and the reasoning. Summary
> below; that document is the source of truth.

`src/app/(frontend)/page.tsx` sets:

```ts
export const dynamic = 'force-dynamic'
```

Every request queries Postgres. No caching, slow TTFB, and on a database that scales to
zero when idle (Neon's free tier) a crawler arriving cold waits seconds. That is a Core
Web Vitals problem and it wastes crawl budget.

`force-dynamic` is a **development convenience** — it makes edits appear on refresh. It is
not a production setting.

**The fix:** static rendering plus revalidation. Remove the flag and add an `afterChange`
hook on each collection and global that calls `revalidatePath()` for the affected routes.
Pages are then static and fast, and rebuild only when an editor publishes.

| Setup | Refresh shows new content | Speed |
|---|---|---|
| `force-dynamic` | always | DB query per view |
| static, no revalidation | no — stale | fast |
| static + revalidate hooks | yes | fast |

The middle row is the trap: a static page with no revalidation serves stale content after
a publish, which destroys an editor's trust in the CMS faster than anything else.

---

## 2. Image sizes — the recurring risk

`src/collections/Media.ts` is `upload: true` with no `imageSizes`, so Payload stores
whatever is dropped in, at full resolution.

This already caused a real failure: an 8 MB PNG of a photograph blew past Next's image
optimiser timeout, produced a `TimeoutError`, and took the homepage to a 29-second render.
Compressing it to 254 KB brought the page to 1.4 seconds.

That was not a one-off. Editors upload straight from a camera or a designer's export, and
they will keep doing it. **The schema is the only place to stop it.**

Declare `imageSizes` so Payload generates resized variants on upload, and use
`formatOptions` to force a modern format. Then the largest file an editor can put on a
page is one you chose, not one they happened to have.

Related: assets in `public/` are served from Cloudflare R2 — see `next.config.ts` and
`src/utilities/asset.ts`. Compress before uploading; R2 has no egress cost but the browser
still has to download the bytes.

---

## 3. Per-page metadata

There is one static `metadata` export in `src/app/(frontend)/layout.tsx`. That is fine for
a single page and useless the moment project detail pages exist.

Each route needs `generateMetadata` reading title, description and an OG image from its
Payload document. `@payloadcms/plugin-seo` adds those fields to the admin panel with a
live search-result preview, which is worth installing before anyone writes content — it
turns metadata into something the editor owns rather than something a developer forgets.

---

## 4. Sitemap and robots.txt

Neither exists. Both should be **generated from Payload**, not written by hand, so new
documents appear without anyone remembering to update a file.

A `sitemap.ts` route that queries the published collections is the clean version. Filter
on `_status: 'published'` so drafts never reach it.

---

## 5. Drafts must not be publicly readable

Draft content that is readable without authentication can be indexed. Today the globals
use `read: () => true` and unpublished content is gated behind Next's draft mode, which is
correct.

**Re-check this whenever a collection is added.** The pattern is `authenticatedOrPublished`
style access — anonymous requests see published documents only. A collection that ships
with `read: () => true` and drafts enabled will leak unpublished work into search results.

---

## Order of work

1. Static rendering + revalidation hooks
2. `imageSizes` on Media
3. `generateMetadata` and the SEO plugin — before project detail pages
4. Sitemap and robots
5. Access-control review at each new collection

The first two matter before launch. The rest matter before there is content worth finding.
