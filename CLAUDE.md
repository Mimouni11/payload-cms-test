# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Architecture

`docs/content-architecture.md` is the source of truth for how components, content, and
Payload config are structured in this project. Read it before adding a section,
collection, global, or field, and follow it.

It covers: folder layout per section, the props-contract pattern, the design-first /
wire-second workflow, the collection vs global vs page-content decision, editor control
panel design (fixed selects over free-text for design choices), theming through CSS
tokens, live-preview gotchas, and the rendering/deployment progression.

If the doc does not cover the decision, or your change would contradict it, **stop and
ask** rather than picking an approach. Do not silently establish a new convention.

## Git

Read-only git commands are fine without asking — `status`, `log`, `diff`, `show`,
`branch --list`, `show-ref`.

**Never run a command that alters git state.** No `commit`, `push`, `add`, `restore`,
`checkout`, `reset`, `merge`, `rebase`, `tag`, `stash`, `branch -d`, or anything else
that writes. Propose the commands and let the user run them.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
