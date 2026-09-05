# Rendering strategy

**Decision: split the public route from the preview route (option A below).** The public
site is statically rendered and served from the CDN; live preview moves to its own route.
Option B is documented as a fallback for pages that genuinely cannot be static.

---

## The problem

`src/app/(frontend)/page.tsx` re-renders on **every request**, and makes two `findGlobal`
calls each time — expertises and stats. That happens for every visitor and every crawler,
and bots hit pages far more often than people do.

Two independent causes, and removing either one alone changes nothing:

1. `export const dynamic = 'force-dynamic'`
2. The `draftMode()` call

The second is the one people miss. Reading draft mode is a dynamic API — the route's
output depends on a per-request cookie, so Next cannot pre-render a single HTML document
that is correct for everyone.

### Why the public route reads draft mode at all

Payload's live preview is **not** a feature of the admin panel. The admin has no idea what
the site looks like — it embeds the real frontend in an iframe:

1. The iframe loads `/next/preview?secret=…`
2. That route enables draft mode (a cookie) and redirects to `path`, default `/`
3. The iframe now displays `/` — the same route visitors get
4. `/` calls `draftMode()` to decide: published content, or the editor's draft?

One route, two audiences. The mechanism that serves the editor is what stops the page
being static for everyone else.

### What it costs

| | function runs | DB queries |
|---|---|---|
| today (`force-dynamic`) | every request | 2 × every request |
| option B — cached data | every request | only after a publish |
| **option A — static** | **never**, for visitors | only at build / revalidate |

On a scale-to-zero database (Neon), constant traffic means the compute never sleeps. With
static pages it genuinely idles and only wakes on publish.

---

## Option A — split the routes (chosen)

- **`/`** — no `draftMode()` call. Fetches published content only. Pre-rendered to static
  HTML and served from the CDN. No function invocation, no database query, no cold start.
- **`/preview`** — renders the same components with draft content. Dynamic and
  cookie-aware. Only the editor ever loads it, so its latency does not matter.
- Each `livePreview.url` changes from `?path=/` to `?path=/preview`. The preview route
  already accepts a `path` parameter.

**The editing experience does not change.** `/preview` keeps the `useLivePreview` hooks
and still updates per keystroke. Live preview is not being replaced by a sync mechanism —
it is only moving off the URL visitors use.

### Required alongside it

An `afterChange` hook on each global and collection calling `revalidatePath()` for the
routes it affects. **Without this the static page serves stale content forever** — an
editor publishes, nothing changes, and they stop trusting the CMS. This is not optional.

### The trade-off, and what it requires

With `force-dynamic`, a published change is visible on the very next request. With static
plus revalidation there is a gap between clicking Publish and the page rebuilding —
usually a second or two, occasionally longer on a cold host.

That is the entire cost, and it is the standard trade every static CMS site makes. But it
is invisible to a developer and confusing to everyone else, so it comes with a hard
requirement:

**The admin must show the editor when their change is actually live.** An editor publishes,
opens the site immediately, sees the old content and concludes the CMS is broken. They will
not wait, and they should not have to know that a rebuild exists.

Specified in `docs/admin-ui.md` under *publish status indicator*. It ships with this
change, not after it.

---

## Option B — cache the data (fallback)

Keep the route dynamic, but stop it reaching the database. Wrap the Payload query in
Next's data cache (`'use cache'` in Next 16, or `unstable_cache`) with a tag, and
revalidate that tag on publish.

```
findGlobal('expertises')          →  runs on every request
cached(findGlobal('expertises'))  →  runs once, then served from cache
                                     until publish invalidates the tag
```

The function still runs per request, so the cold start and the compute cost remain — but
the database round-trip disappears.

**Use it when:**

- The publish-to-visible gap in option A becomes a genuine complaint
- A page cannot be static by nature — search results, filtered listings, anything
  personalised or per-user

For a brochure site whose content changes weekly, B is strictly worse than A on both cost
axes. It is a fallback, not an alternative.

---

## Open question: scheduled jobs

`schedulePublish: true` is set on the Expertises and Stats globals, and there is no `jobs`
block in `payload.config.ts`. The option appears in the admin, an editor can set a date,
and **nothing ever happens** — no error, no warning, the content silently stays draft.

Scheduled publishing depends on Payload's jobs queue, which needs something to invoke it
on a schedule. On a long-running host that is an `autoRun` config flag. On serverless
there is no persistent process, so it requires an external scheduler hitting an endpoint —
a Netlify scheduled function, or a cron service.

Unresolved. Until it is, either wire the queue up or remove `schedulePublish` from those
configs — an editor discovering the button does nothing is worse than never offering it.
