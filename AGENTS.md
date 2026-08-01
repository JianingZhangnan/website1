# FPKS website agent instructions

## Start here

Before changing this repository, read:

1. `docs/AI_HANDOFF.md` for architecture, sources of truth, deployment, and validation.
2. `docs/DESIGN_BRIEF.md` for the current visual direction and product boundaries.

This file is the canonical instruction file for coding agents. `CLAUDE.md` is only a compatibility entrypoint and must not duplicate these rules.

## Project boundaries

- This repository is a Quartz 4 static knowledge garden, not the complete private FPKS vault.
- Treat `content/` as a generated public snapshot. Do not bulk rewrite, rename, delete, or reorganize notes unless the user explicitly asks for content work.
- Never add private vault files, credentials, `.env*`, keys, PDFs, fonts, editor state, `node_modules/`, or `public/`.
- Keep the site static and compatible with Cloudflare Pages. Do not add a server, database, authentication, or paid service without explicit approval.
- Preserve Obsidian links, LaTeX, code blocks, search, graph, backlinks, light/dark modes, and Chinese typography.

## Where to make frontend changes

Prefer these project-owned files:

- `quartz.config.ts` for site metadata, theme tokens, and plugin configuration.
- `quartz.layout.ts` for page composition.
- `quartz/styles/custom.scss` for visual customization.
- New, narrowly scoped components under `quartz/components/` only when configuration and CSS are insufficient.

Avoid modifying Quartz framework internals merely to restyle the site. Keep changes easy to review and to carry across future Quartz upgrades.

## Development workflow

```powershell
npm ci
npm run dev
```

For non-trivial work, start from current `main` on a short-lived branch such as `frontend/navigation`. Before handoff, run:

```powershell
npm run check
npm run build
```

Do not force-push, rewrite shared history, commit generated output, or silently relax validation. Report changed files, checks run, and any remaining tradeoffs. `main` is deployed to production; branch pushes should be reviewed in their Cloudflare preview before merge.

## Publishing contract

The desktop publisher in `scripts/publish.ps1` is responsible for synchronizing the public content subset every 12 hours. It first fast-forwards from GitHub so frontend changes are not overwritten or stranded. Changes to its allowlist, exclusions, secret scan, Git behavior, or task interval are operational changes and require corresponding documentation and validation.
