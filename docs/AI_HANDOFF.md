# FPKS website engineering handoff

Last updated: 2026-11-03

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

Before each content sync, the desktop publisher requires a clean checkout, fetches `origin/main`, and performs a fast-forward-only merge. This prevents a new content commit from diverging after frontend work lands on GitHub. It then mirrors only approved directories and file types (excluding AI instruction files such as `AGENTS.md`), removes notes whose YAML frontmatter has `draft: true` (unreviewed vault notes; Quartz would not render them, but their source must not enter the public repository either), rejects forbidden/oversized files and likely secrets, builds Quartz, and pushes any local commits.

The owner's explicit 2026-11-05 publication request covers the exact Fermi-gas topic notes in `scripts/publish-approved-notes.json`. `prepare-approved-notes.mjs` removes `draft: true` only from those generated public copies, preserving the private vault markers. No other draft is exempt. The owner's 2026-11-11 publication request also covers the exact note `统计物理/高统/电磁场的横纵分解与偏振基.md`, using the same public-copy mechanism while preserving its private `draft: true` marker. `publish.ps1 -NotePaths @('统计物理/费米气体/费米气体.md', ...) -NoPush` copies only the named Markdown notes and skips full mirroring and drawing export; it retains draft filtering, forbidden-file and secret checks, build, and clean-main requirements. Run it from PowerShell with an actual array. Omit `-NotePaths` for the ordinary full allowlisted sync.

Fermi-gas notes are grouped under `统计物理/费米气体/` in both the vault and generated content: the short entry derives occupation numbers, `热力学量与费米积分` gives the number equation, and `零温与低温` explains the step limit. DOS, small-fugacity series, and Sommerfeld calculations are separate supporting notes. Existing root-level URLs redirect through aliases; block links were updated to the notes that now own those blocks. Common tools such as `态密度与热波长` stay outside the topic folder. Use fully qualified wiki targets for moved Fermi notes: their old root-level aliases make shortened targets ambiguous in Quartz.

The widget shell is `quartz/static/interactive/fermi-dirac.html`; its adjacent `fermi-dirac/` directory separates CSS, numerical integration, plotting, theme/lifecycle, and the two views. `fermiVisuals.ts` inserts only the integral and low-temperature widgets at their respective note headings; there is no standalone occupation plot. Integral curves support single-order view or checkbox comparison; Plotly uses wheel-only zoom, drag-to-pan, and reset; rectangle zoom and the Plotly modebar are disabled. Widget entry and relative module imports share a release query token to bypass previously cached modules; update the token together when changing widget behavior. Standalone pages have explicit light/dark controls; embedded widgets follow the article. All formulas are rendered by the site's MathJax engine at build time via `fermiAssets.ts`, called before the shared stylesheet/font pass. The pinned Plotly basic bundle and its license are copied from npm into output during build; no CDN or generated assets are committed. These widgets are not stored in the vault.

As of 2026-11-03 the scheduled task `FPKS Website Publish` is disabled, so publishing is a deliberate manual run of `scripts/publish.ps1`.

### Excalidraw drawings

Source notes (frontmatter `excalidraw-plugin:`) are never published; the publisher removes them from `content/` wherever they appear. Instead, `scripts/excalidraw-export/` (desktop only, with its own `package.json`, not part of the Cloudflare build) renders them in headless Chrome with Excalidraw's own exporter and writes an SVG plus a small stub note.

- A drawing is published only if every image and formula resolves. A failure skips that drawing and is logged; it never falls back to the raw note.
- Templates, drawings named `DRAFT`, `draft: true`, empty boards, and everything listed in `scripts/excalidraw-export/private-drawings.json` are skipped. That list is the owner's decision; do not remove entries without asking.
- `content/Excalidraw/` holds only generated output and is pruned on each run. Drawings under an `assets/` folder are moved there too, so `assets` does not appear in the explorer.
- Renders are cached by content hash in `%LOCALAPPDATA%\FPKS-Publish\excalidraw-cache`, so unchanged drawings produce no Git changes.
- Drawings are static: links inside them are not clickable, and they sit on a paper-coloured sheet in dark mode rather than being inverted.
- The SVG exposes the drawing's text and images, and any drawing not on the list above is published by the next run. Add a new private drawing to the list before publishing.

### Formulas

Formulas are rendered at build time with MathJax 4.1.3 to match the vault's Obsidian plugins `mathjax4-pagella` (Pagella with selected NewCM, Asana, Modern, STIX and Termes glyphs, 1.15 scale, `cases` in display style, spaced script commas) and `auto-displaystyle-v2` (inline math in display style, full-size fraction parts). Layout rules in `custom.scss` come from the vault's `block-math-zoom.css` and `inline-math-zoom.css`.

- `fontExtensions.ts` and `hybrid-font-data.json` are copies from the vault plugin. When the plugin changes, copy them again rather than editing them here. All `@mathjax/*` packages stay pinned to one exact version.
- WOFF2 files are copied from those npm packages into `public/static/fpks-math/` during the build, so no font file is committed. The typefaces keep their own licences (GUST, SIL OFL) in the files' embedded metadata.
- `normalizeMathFences` and `remarkDisplayMath` make `$$` parse as in Obsidian: text on the fence lines and one-line `$$x$$` are display formulas.
- Known difference: Obsidian's bundle still runs semantic enrichment although the plugin sets `enableEnrichment: false`, which adds about 0.2em around some invisible multiplications (about 4% of formulas). The site follows the plugin's setting and leaves enrichment off.

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
- `quartz/plugins/transformers/dedupeTitle.ts`: removes a first H1 identical to the page title.
- `quartz/plugins/transformers/noteRelativeLinks.ts`: resolves Obsidian note-relative paths such as `![[assets/x.png]]`, which Quartz's "shortest" strategy only tries from the root.
- `quartz/components/TopicGrid.tsx`: home page topic entries; edit its list when a top-level topic changes.
- `quartz/components/scripts/explorer.inline.ts`: local edits (`block: "nearest"`) stop page jumps; `expandCurrentPath` is configurable, and disabling persistent state retains manual folder choices only within the current SPA visit. The layout starts every fresh page with all folders collapsed, including the active article's ancestors, and ignores legacy `fileTree` storage. Keep these edits across Quartz upgrades.
- `quartz/components/SidebarResize.tsx` and `scripts/sidebarResize.inline.ts`: desktop/tablet sidebar resizing by dragging its right edge or using arrow keys; double-click resets to 320px. Width is remembered separately as `fpks-sidebar-width`, bounded to 240–640px and the space available for the article. The mobile navigation keeps its original width. `custom.scss` hides directory scrollbars while retaining scrolling.
- `quartz/components/renderPage.tsx`: core JS, CSS, and the content index include a deployment version query (`CF_PAGES_COMMIT_SHA`, or a local build ID). Pages gives these files a four-hour browser cache; versioning prevents returning readers from combining new markup with an old explorer or directory index. Keep this behavior across Quartz upgrades.
- `quartz/plugins/transformers/navFont.ts`: loads ZCOOL KuaiLe from Google Fonts for the left rail, whose stack is `--fpks-nav-font` in `custom.scss` (Comic Sans MS for Latin text).
- `quartz/plugins/transformers/fpksMath/`: formula rendering, see "Formulas" below.
- `quartz/components/scripts/graph.inline.ts`: local edits add the `connectedComponent` option (used by the expanded graph) and edge clicks, which jump to the first link between the two notes. Keep them across Quartz upgrades.
- `quartz/components/scripts/popover.inline.ts`: local edit shows only the linked heading section or block when a link has a fragment. Keep it across Quartz upgrades.
- `scripts/publish.ps1`: desktop content publication and safety checks.
- `scripts/excalidraw-export/`: renders Excalidraw drawings to SVG for the publisher.
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
- Automatic knowledge publication was designed to run every 12 hours; the task is currently disabled (see above).
- Public allowlist as of 2026-11-04: `AISE`, `assets`, `DSP` (without `DSP/hw`, which holds the owner's real name and student ID, `DSP/slides`, and `DSP/tmp`), `Group` (without `Group/homework`), `数理方法`, `统计物理`, `量子力学`, and `笔记写作规范.md`. `重整化群与临界指数` was taken down because it no longer exists in the vault, and `英语` (now `Language` in the vault) was taken down by the owner's decision; their history remains in Git.
- Page dates on production are unreliable: Cloudflare's checkout makes every page report the latest commit date. Do not build features on them until this is fixed.
- Large/private vault files stay in Baidu Netdisk and are excluded from Git and the public website.
- GitHub is the cross-machine handoff point for frontend development; copied dependency folders and AI chat sessions are not part of the handoff.
