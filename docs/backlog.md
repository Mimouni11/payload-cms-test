# Backlog

Working list. Tick items off as they land; delete this file when it empties.

Ordering below is by risk, not by how interesting the work is.

---

## Risk and correctness

- [x] **1. Rendering split (fix A)** — done.
      `/` is `force-static`, `/preview` is dynamic, both render the shared
      `_home/HomeView` so the markup cannot drift. `revalidateHome` hooks on both globals
      and Media, guarded so autosave does not trigger rebuilds. `/next/content-version`
      reports what the static site is serving, and `PublishStatus` compares it against the
      database to tell the editor when a publish is actually live.

- [ ] **2. Migration gap**
      Only `20260903_191830_initial` exists, and it predates the Expertises and Stats
      globals — those reached Neon through dev push, not a migration. A database built
      from migrations alone would be missing both tables.
      Netlify runs `payload migrate` on deploy, so this works today only because that one
      database already has the schema. Generate a catch-up migration.

- [ ] **3. `push: false` on the postgres adapter**
      Not set, so it defaults on in development. This is what hung the dev server twice on
      a hidden interactive y/N prompt. Migrations exist now; push is pure hazard.

- [ ] **4. R2 credentials in Netlify**
      `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
      Without them the build succeeds and uploads fail at runtime — the worst kind of
      failure, because nothing looks wrong until an editor tries to add a photo.

- [ ] **5. `schedulePublish`**
      Enabled on the Expertises and Stats globals with no `jobs` block in the config, so
      the option appears in the admin and silently does nothing.
      Either wire the jobs queue (an external scheduler on serverless, an `autoRun` flag on
      a long-running host) or remove it. A button that lies is worse than no button.

---

## Content model

- [ ] **6. Projets carousel**
      Analysed, not built. Four decisions still open:
      - Do projects get detail pages, or is "LIRE" decorative for now?
      - Tags: free text, fixed select, or a relationship to a services collection?
        (Free text drifts from the expertise names; a relationship means promoting
        expertises from a global to a collection.)
      - Homepage selection: `featured` flag, or latest N?
      - Dots: pages of two, or one card at a time?

- [ ] **7. Navbar, Hero and ClientLogos are still hardcoded**
      Only Expertises and Stats are editor-controlled. The hero headline — the most visible
      copy on the site — lives in a TypeScript file. A demo that pitches "your team edits
      the site" while the headline is uneditable undercuts itself.

- [ ] **8. Payload roles**
      `admin` vs `editor`. Everything currently gates on "is anyone logged in", so any
      account can edit users and settings. This is the piece that makes a handoff to a
      non-technical client safe.

---

## SEO and polish

- [ ] **9. `imageSizes` on the Media collection** — before launch. See `docs/seo.md`.
      Without it the largest file on a page is whatever an editor happened to upload.

- [ ] **10. `generateMetadata` and the SEO plugin** — before detail pages exist.

- [ ] **11. Sitemap and robots.txt**, generated from Payload, filtered on published status.

- [ ] **12. Admin quick wins** — `RowLabel` on the Expertises and Stats arrays, panel
      branding in `custom.scss`. See `docs/admin-ui.md`.

- [ ] **13. Logo as SVG** — the current `logo.png` is 122px wide and soft on retina.
      Needs the vector export from whoever owns the Figma file.

- [ ] **14. Per-keystroke live preview**
      `@payloadcms/live-preview` and `@payloadcms/live-preview-react` are installed but
      never imported. Preview currently reflects changes on iframe reload, not as you type.
      Adding `useLivePreview` to `/preview` would close that gap.
      Two things to know before starting: the incoming message is admin **form state**, not
      a document, so it must go through `mergeData` and then the existing `adapt*` functions;
      and `useLivePreview` caches in a module-level singleton, so two hooks on one page
      overwrite each other — a second previewing region needs a direct subscription filtered
      on `globalSlug`.

---

## Done

- Navbar, Hero, ClientLogos, Expertises and Stats sections built
- Expertises and Stats editable through Payload globals
- Media uploads stored in Cloudflare R2
- Neon Postgres with an initial migration
- Dev-only seed route
- Tailwind v4 migration
- Docs: content architecture, rendering, SEO, admin UI
