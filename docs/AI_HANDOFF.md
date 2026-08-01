# FPKS website engineering handoff

Last updated: 2026-08-01

## Current state

- Production: <https://notes.zjnmcp.me/>
- Cloudflare fallback: <https://jianing-fpks.pages.dev/>
- Repository: <https://github.com/JianingZhangnan/website1>
- Stack: Quartz 4.5.2, TypeScript, Preact, Sass, Node.js 22+, Cloudflare Pages.
- Production branch: `main`.
- Cloudflare build: `npx quartz build`; output: `public`.

## Sources of truth

| Concern                                 | Canonical source                       | Notes                                                            |
| --------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| Frontend, configuration, and automation | GitHub `main`                          | Clone this repository on every development machine.              |
| Complete private knowledge base         | `D:\BaiduSyncdisk\FPKS` on the desktop | Synced by Baidu Netdisk; never publish the whole folder.         |
| Public knowledge snapshot               | `content/` in this repository          | Updated by the allowlisted publisher, not a backup of the vault. |
| Production artifact                     | Cloudflare Pages                       | Rebuilt from `main`; do not edit the deployed output by hand.    |

`D:\learn\FPKS` on the desktop is a compatibility Junction to `D:\BaiduSyncdisk\FPKS`. The publisher intentionally uses the Junction path so existing automation remains stable.

## Data and deployment flow

```text
Laptop frontend branch ──push/review──> GitHub main ──build──> Cloudflare Pages
                                           ^
                                           |
Desktop private FPKS ──allowlist/safety scan/build/commit every 12 h
```

Before each content sync, the desktop publisher requires a clean checkout, fetches `origin/main`, and performs a fast-forward-only merge. This prevents a new content commit from diverging after frontend work lands on GitHub. It then mirrors only approved directories and file types, rejects forbidden/oversized files and likely secrets, builds Quartz, and pushes any local commits.

## Laptop setup and normal workflow

```powershell
git clone https://github.com/JianingZhangnan/website1.git D:\cs\site
Set-Location D:\cs\site
git switch main
git pull --ff-only
git switch -c frontend/<short-topic>
npm ci
npm run dev
```

When the change is ready:

```powershell
npm run check
npm run build
git status --short
git add -- <intentional paths>
git commit -m "Describe the frontend change"
git push -u origin HEAD
```

On a new computer, the first HTTPS push may open Git Credential Manager for GitHub login. SSH is an alternative, but the private key must never be added to this repository. Review the Cloudflare branch preview and then merge to `main`. Pull `main` after merge.

## Change map

- `quartz.config.ts`: title, canonical domain, locale, plugins, typography, and color tokens.
- `quartz.layout.ts`: left/right rails, navigation, search, graph, table of contents, and footer.
- `quartz/styles/custom.scss`: project-owned visual refinements.
- `quartz/components/`: reusable UI components; add code here only when layout/configuration/CSS cannot express the change.
- `content/`: public note snapshot; protect filenames, wikilinks, math, images, and frontmatter.
- `scripts/publish.ps1`: desktop content publication and safety checks.
- `scripts/install-scheduled-task.ps1`: installs the 12-hour Windows task on the desktop.

Quartz framework files also live under `quartz/`. Prefer project-owned configuration and custom styles over broad framework edits, because upstream upgrades otherwise become unnecessarily difficult.

## Acceptance checks

Run both commands before handing work back:

```powershell
npm run check
npm run build
```

Also inspect the site at desktop and mobile widths and verify:

- the home page, a note page, and a folder page render;
- search, explorer navigation, backlinks, graph, reader mode, and dark mode still work;
- Chinese text, long formulas, code blocks, tables, and images do not overflow;
- internal links and asset URLs work under `https://notes.zjnmcp.me/`;
- no secret, private note, generated `public/`, or dependency directory is staged.

## Operational boundaries

- The repository contains the website and its public snapshot, not a general three-way file-sync solution.
- Baidu Netdisk protects/synchronizes the complete working vault; Git carries code and public text history; Cloudflare hosts the static output. Each tool has one job.
- Do not change the public-content allowlist or make the repository private/public without an explicit decision.
- Do not put machine credentials, Tailscale details, Cloudflare tokens, GitHub keys, or conversation transcripts in tracked documentation.
- If an automated publish fails, inspect `%LOCALAPPDATA%\FPKS-Publish\publish.log`. Resolve dirty working trees or non-fast-forward history deliberately; do not use destructive resets.

## Decisions already made

- Static Cloudflare Pages hosting is sufficient; a VPS would add maintenance without a current server-side requirement.
- The custom domain is `notes.zjnmcp.me`.
- Automatic knowledge publication runs every 12 hours rather than continuously.
- Large/private vault files stay in Baidu Netdisk and are excluded from Git and the public website.
- GitHub is the cross-machine handoff point for frontend development; copied dependency folders and AI chat sessions are not part of the handoff.
