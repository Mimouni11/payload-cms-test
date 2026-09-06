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

- [x] **2 + 3. Migrations replace dev push** — done.
      `push: false` on both adapters. The stale migration (which predated the Expertises
      and Stats globals) was deleted and regenerated against the current config, so it now
      creates all 21 tables. The database's `dev` / batch `-1` marker was replaced with
      that migration recorded as applied — the tables already existed, so it must be
      recorded rather than executed.

      **What this was actually costing:** every Netlify deploy ran `payload migrate`, hit
      *"It looks like you've run Payload in dev mode… proceed? (y/N)"*, and sat there for
      **5m17s** before defaulting to no. Migrations had never once run in production, and
      no deploy ever failed, so nothing surfaced it. Deploys should now be ~1 minute.

      **Workflow from here:** change a config → `pnpm payload migrate:create <name>` →
      commit the file. Never push.

- [x] **4. R2 credentials in Netlify** — done and verified. Uploads reach the bucket from
      the deployed site.

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

- [ ] **7. Client logos are hardcoded**
      The marquee band is five entries in `ClientLogos/placeholder.ts` pointing at files
      uploaded to R2 by hand. Winning a new client currently means a developer edits a
      TypeScript file and deploys.
      Smallest possible collection — `name`, `logo` upload, `order`, optional `website`.
      One risk to design around: the row normalises every logo to 44px tall, so a badly
      cropped upload will look wrong. Same exposure as project photos.

      **Decided: Navbar and Hero stay hardcoded.** That copy changes once a year, and the
      hero's layout depends on the headline breaking exactly where it does. Not worth the
      fields.

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
- Static homepage with `/preview` split, revalidation hooks and publish status indicator
- Live preview subscription — edits appear without reloading the iframe
- Schema managed by migrations; `netlify.toml` holds the build command
- Docs: content architecture, rendering, SEO, admin UI
