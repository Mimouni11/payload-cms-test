# BigArt Group

Marketing site for Groupe BigArt, built with Payload CMS inside Next.js.

| | |
|---|---|
| CMS + app | Payload 3 running inside Next.js 16 (App Router) |
| Database | Postgres (Neon) in production, SQLite locally if you point at a file |
| Media | Cloudflare R2 via `@payloadcms/storage-s3` |
| Styling | Tailwind v4, tokens in `src/app/(frontend)/styles.css` |
| Hosting | Netlify — build config in `netlify.toml` |

---

## Local setup

```bash
cp .env.example .env     # then fill in the values below
pnpm install
pnpm dev
```

Open `http://localhost:3000` for the site, `/admin` for the CMS.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (or `file:./site-test.db` for SQLite) |
| `PAYLOAD_SECRET` | Signs auth tokens. Must match between environments sharing a database |
| `PREVIEW_SECRET` | Guards the preview and seed routes |
| `NEXT_PUBLIC_SERVER_URL` | Origin used by live preview |
| `cloudflare_r2` | Public R2 bucket URL for static assets |
| `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Media uploads |

The adapter is chosen from `DATABASE_URL`: anything starting with `postgres` uses
Postgres, otherwise SQLite.

### Seeding an empty database

```bash
curl "http://localhost:3000/next/seed?secret=$PREVIEW_SECRET"
```

Development only, and it refuses to run if content already exists. To seed a remote
database, point `DATABASE_URL` at it and run this locally.

---

## Changing the schema

**`push` is disabled.** The dev server will not apply schema changes for you — that is
deliberate. Dev push leaves no history, and it previously left this project with a
database no one could rebuild and a deploy that sat five minutes on a hidden prompt.

You only need this when the **schema** changes:

| Change | Migration needed? |
|---|---|
| Editing content in the admin | No |
| Components, CSS, placeholder copy | No |
| Adding or removing a field, collection or global | **Yes** |
| Changing a field's type or `required` | **Yes** |

```bash
# 1. edit the collection or global config
pnpm payload migrate:create add-projets   # generates src/migrations/<timestamp>_add-projets.ts
pnpm payload migrate                      # applies it
pnpm generate:types                       # regenerates src/payload-types.ts

git add src/migrations src/collections
git commit -m "feat(cms): add projets collection"
```

> **Run those three before loading a page.** The moment you save the config, the dev
> server hot-reloads and starts querying tables the migration has not created yet — you
> will get `relation "…" does not exist` and a 500 until `migrate` runs. It looks alarming
> and is not: the schema is simply behind the code for a few seconds.
>
> This is the cost of `push: false`. With push the dev server would create the table for
> you and you would never see it — which is also how the schema silently drifted out of
> version control and left production broken for two hours. The error is the trade.

Some prompts to expect from `migrate:create`: when a table is added while another is
removed, drizzle asks whether it is a **create** or a **rename**. Choose *create* unless
the two really are the same table under a new name — the tables usually have different
shapes, and answering "rename" keeps the wrong one.

Netlify runs `payload migrate` before every build, so the deploy applies anything not yet
recorded. Useful commands:

```bash
pnpm payload migrate:status   # what is applied and what is pending
pnpm payload migrate:down     # roll back the last batch
```

> **Careful:** local development and Netlify currently share one Neon database, so
> `pnpm payload migrate` changes production immediately — before the code that uses it is
> deployed. Additive changes are harmless; a destructive one breaks the live site until
> the deploy lands. Run migrations right before pushing, or give local dev its own Neon
> branch.

### After adding a custom admin component

```bash
pnpm generate:importmap
```

Commit the updated `importMap.js`. Skipping this breaks the admin panel **in production
only** — your local file is correct and the committed one is stale.

---

## How rendering works

- **`/`** is statically rendered and serves published content only. No database query per
  visitor.
- **`/preview`** is dynamic, reads draft content, and subscribes to Payload's live-preview
  channel so edits appear without reloading.
- Publishing triggers `revalidatePath` (`src/hooks/revalidateHome.ts`), which rebuilds the
  static page. The admin shows a status indicator so editors know when their change is
  actually live.

Full reasoning in `docs/rendering.md`.

---

## Commands

```bash
pnpm dev                  # development
pnpm build                # production build — check the route table for ○ / (static)
pnpm start                # serve the production build
pnpm generate:types       # after every schema change
pnpm generate:importmap   # after adding a custom admin component
./node_modules/.bin/tsc --noEmit
```

---

## Documentation

| File | Contents |
|---|---|
| `docs/content-architecture.md` | Folder layout, props contract, design-first workflow, editor control panel |
| `docs/rendering.md` | Static vs preview split, revalidation, caching fallback |
| `docs/seo.md` | Image sizing, metadata, sitemaps, draft visibility |
| `docs/admin-ui.md` | Customising the admin panel, import map warning |
| `docs/backlog.md` | Outstanding work |
