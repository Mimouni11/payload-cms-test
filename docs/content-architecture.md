# Content architecture

How we structure components, content, and Payload config in this project, and why.

---

## The one principle

**Schema is code. Content is data.**

Field definitions, select options, layouts, colours, and every design decision live in
version control. The database stores only what an editor chose — usually a string, a
number, or an ordering.

This is why a variant select is `'gradient' | 'editorial'` in a config file while the
database holds the single word `editorial`. It is also why dropping a database costs you
content and nothing else: the schema rebuilds itself from code.

---

## Folder layout

One folder per section. Everything about that section lives inside it.

```
src/blocks/Hero/
  Component.tsx     pure presentation — imports no Payload types
  types.ts          the props contract
  placeholder.ts    sample data satisfying the contract
  config.ts         Payload field config (added when the section is wired)
  index.ts          re-exports
```

Two reasons this beats a shared `constants/` or `content/` directory:

- **Deleting a section is deleting a folder.** No orphaned keys left behind in a shared
  file, no hunting for what belonged to what.
- **The field config sits next to the component it configures.** Change a field and the
  thing that renders it is in the same directory. A central content file guarantees the
  opposite — config drifts away from its component.

Collections and globals stay where Payload expects them:

```
src/collections/    one file per collection
src/globals/        one file per global
src/payload.config.ts   registers both
```

---

## The props contract

A component depends on its **own** props type, never on `payload-types.ts`.

```ts
// src/blocks/Hero/types.ts
export type HeroProps = {
  eyebrow?: string
  title: string
  lede?: string
  variant: 'gradient' | 'editorial'
}
```

Both the placeholder object and the eventual Payload document satisfy it. The component
never learns where its data came from, which means:

- Wiring a section to the CMS is a change in the **page**, not in the component.
- The component is testable with a plain object.
- Swapping the data source later touches one file.

If the generated Payload type turns out identical to the contract, alias it and move on.
Write a real mapping function only when the shapes actually diverge — nullable fields,
populated relationships, a rich-text tree you flatten. Do not build an adapter layer
speculatively.

---

## Workflow: design first, wire second, section by section

Design and schema move at different speeds. Design changes hourly; a schema wants to
settle over days. Building both at once puts config edits and `generate:types` runs in
the way of the thing you need to iterate fastest.

So, per section:

1. **Decide its kind first** — collection, global, or page content. See below; this is a
   design constraint, not an implementation detail.
2. **Build it with `placeholder.ts`** as the data source. Iterate on the design freely.
3. **Get it approved.**
4. **Wire it** — write `config.ts`, register it, `pnpm generate:types`, swap the
   placeholder import for a query.
5. **Next section.**

Do not design the whole site and then CMS-ify the whole site. You will bake the same bad
assumption into ten sections before discovering the first one models badly.

### Decide the kind before designing

| Kind | When | Design consequence |
|---|---|---|
| **Collection** | Many of them, editor adds and removes | Layout must survive 1 item and 40. Needs an empty state. |
| **Global** | Exactly one — nav, footer, site settings | Fixed slots, no list view |
| **Page content** | Belongs to one page only | Lives on that page's document |

Getting this backwards is the expensive mistake. Field names are cheap to change; a card
grid designed for exactly three items is not.

---

## Placeholders become seed data

`placeholder.ts` is not throwaway. It is the input to the seed route, which writes it
into Payload through the Local API so one request populates an empty environment.

You will need this. A fresh database — a new Neon branch, a teammate's first clone, a
staging reset — starts with an empty admin panel and nothing to look at.

### The seed route

`src/app/(frontend)/next/seed/route.ts`:

```
GET /next/seed?secret=<PREVIEW_SECRET>
```

It never runs on its own — no startup hook, no cron. Three guards, in order:

1. **Development only.** Returns 404 when `NODE_ENV === 'production'`. It is a write
   endpoint and has no business being reachable on the public site.
2. **Requires `PREVIEW_SECRET`.** Wrong or missing → 401.
3. **Refuses a non-empty target.** If the global already has rows → 409 and no write, so
   calling it twice cannot duplicate content.

To seed a **remote** database, point `DATABASE_URL` at it and run the route locally.
That is deliberate: seeding is an operator action, not something the deployed app offers.

Images referenced by a placeholder are fetched and re-uploaded through
`payload.create({ collection: 'media', file })`, so they pass through the storage adapter
exactly as an editor upload would, rather than being written straight to the bucket.

### After seeding, delete the fallback

While a section is being built, the page may fall back to the placeholder when the CMS
returns nothing. **Remove that fallback once the content is seeded.** Leaving it means two
sources of truth that drift silently — the page keeps rendering stale code content while
an editor wonders why their change did nothing. The database is the source of truth; the
placeholder is seed input only.

---

## Designing the editor's control panel

The editor changes **content**, plus whatever **design switches** we deliberately
exposed. They cannot invent new ones.

- Free-text fields for genuine content: headings, copy, labels.
- **Selects with a fixed option list** for design choices: variant, colour treatment,
  layout. Never a free colour or class field — three curated options keep the site
  coherent for years; a free hex field means neon green ships on a Friday.
- `admin.condition` to hide fields that do not apply to the current selection. Do not ask
  for information you will not use.
- A **visibility checkbox** (optionally with a "show again on" date) to hide a section
  without deleting its content.

### Variant or block?

- **One section, several looks → variant.** A select plus CSS overrides on the same
  markup. Switching is lossless because the fields are shared.
- **Many sections, any order → blocks.** The editor stacks and reorders.

If a variant needs *different fields*, that is the signal it should be a block instead.
Variants must be a presentation difference over shared data, or switching strands the
editor's content in columns nothing renders.

---

## Theming

Every colour resolves through a CSS custom property defined on `:root` in
`src/app/(frontend)/styles.css`. A theme redefines the same token names under a
`[data-theme='…']` selector, and the attribute is set on `<html>` in the frontend layout
so it covers every route.

A hex value written directly into a rule is unreachable by any theme. If you hardcode a
colour, you have opted that element out of theming — including gradient stops and
`rgba()` glows, which are easy to miss.

---

## Gotchas

**Run `pnpm generate:types` after every schema change.** Stale types produce errors that
point nowhere near the actual mistake.

**Guard CMS arrays with `Array.isArray()`, not `?? []`.** Data arriving from live preview
is mid-edit form state; `?? []` only catches null and undefined, and anything else falls
through to `.filter` and crashes the render.

**Live preview messages are form state, not documents.** Use `mergeData` from
`@payloadcms/live-preview` — it POSTs the message back to Payload and returns a real
document. Hand-merging with a spread leaves nested arrays in a shape the render code
cannot use.

**`useLivePreview` cannot be used twice on one page.** It caches its merged document in a
module-level singleton, so two hooks overwrite each other. For a second live-previewing
region, subscribe directly: filter on `event.data.globalSlug`, call `mergeData`, and keep
your own cache in a ref.

**Layouts do not receive live-preview messages.** Anything set in `layout.tsx` — the theme
attribute, for instance — needs a preview refresh rather than updating per keystroke.

**Handle the empty case.** An editor will eventually produce a combination nobody
pictured: every dropdown entry disabled, an array with zero rows, a missing optional
upload. Components must degrade rather than assume well-formed data.

---

## Rendering and deployment

`export const dynamic = 'force-dynamic'` is a development convenience — it queries the
database on every request so edits appear on refresh.

Before production, switch to static rendering and add `afterChange` hooks calling
`revalidatePath()`. Without revalidation a static page serves stale content after a
publish, which is the one failure mode that undermines trust in the CMS.

| Setup | Refresh shows new content | Speed |
|---|---|---|
| `force-dynamic` | always | DB query per view |
| static, no revalidation | no — stale | fast |
| static + revalidate hooks | yes | fast |

**Database:** `payload.config.ts` picks Postgres when `DATABASE_URL` starts with
`postgres`, SQLite otherwise. Serverless hosts have ephemeral filesystems, so SQLite
cannot persist there; a VPS with a mounted volume can use either.

**Uploads** land on local disk by default and do not survive a serverless deploy. A
storage adapter is required before anyone uploads anything they expect to keep.

---

## Commands

```bash
pnpm dev                  # local dev
pnpm generate:types       # after every schema change
pnpm build                # catches deploy errors before the host does
npx tsc --noEmit          # typecheck alone
```
