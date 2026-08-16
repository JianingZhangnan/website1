# FPKS website engineering handoff

Last updated: 2026-08-17

## Architecture and sources of truth

| Concern                  | Canonical source                   | Contract                                                         |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------------- |
| Private notes            | `D:\BaiduSyncdisk\FPKS`            | Baidu Netdisk only; no Git and never a site root                 |
| Website code             | this Git repository                | Shared between laptop and desktop through Git                    |
| Existing garden snapshot | `content/`                         | Public snapshot, manually reviewed                               |
| Acoustic report approval | `sites/acoustic/publication.json`  | Explicit list matching REPORT's direct wikilinks                 |
| Acoustic public snapshot | `sites/acoustic/content/`          | Generated only after an explicit `--apply`, then reviewed in Git |
| Existing production      | <https://notes.zjnmcp.me/>         | Quartz `main` profile, output `public/`                          |
| Acoustic production      | <https://speechproject.zjnmcp.me/> | Separate Quartz profile, output `public-acoustic/`               |

Laptop paths are `D:\BaiduSyncdisk\FPKS` and `D:\cs\site`. The desktop website checkout is `D:\site\website1`; `D:\learn\FPKS` may remain as a compatibility junction to the Baidu-synced vault.

The old 12-hour mirror/commit/push workflow is retired. `scripts/install-scheduled-task.ps1` now refuses installation, `scripts/disable-scheduled-task.ps1` disables the legacy task, and `scripts/publish.ps1` is a manual preview/apply/build wrapper with no Git or deployment actions.

On 2026-08-16 the desktop task `FPKS Website Publish` was verified and disabled (`Enabled=false`); it was retained rather than deleted for auditability.

## Publication boundary

The acoustic source is `声学项目/REPORT.md`. The staging process publishes:

1. REPORT as the site index;
2. Markdown and PDF files directly referenced by REPORT wikilinks;
3. only the images/audio/video required to render those approved notes and Excalidraw scenes.

It does not follow links from an approved note to a second note. REPORT's normalized direct-link set must exactly equal `approvedDirectLinks`; drift is a hard error so a newly private/public link cannot silently change the website. `Language` and `Lauguage` are blocked by path segment, case-insensitively, in the manifest-driven stage, output check, and Quartz ignore patterns.

Current approved pages are REPORT plus `GTCRN`, `LiSenNet`, `DeepFilterNet2`, `Data note`, `LiSenNet input`, and `BM and ERB`. The three directly linked papers and 19 required image/audio files are copied under `assets/files/`. PDF++ rectangle embeds additionally produce two content-addressed, lossless WebP crops under `assets/files/generated/pdf-plus/`. That entire directory is Git LFS-tracked; Markdown, scene JSON, and code remain regular Git objects. Every asset is below the 24 MiB Cloudflare file limit. Files that exceed that limit, or large frequently changing datasets, belong in an explicitly approved R2 publication flow rather than Git LFS or the private vault.

## Manual workflow

```powershell
Set-Location D:\cs\site

# Read-only boundary preview
npm run stage:acoustic

# Explicitly replace only sites/acoustic/content after review
npm run stage:acoustic -- --apply

npm run check:publication
npm run build:acoustic
npm run dev:acoustic

# Explicit production upload; never run from a timer or push hook
npm run deploy:acoustic
```

The apply step first builds a sibling staging directory, validates it, and then replaces exactly `sites/acoustic/content`. It never writes into FPKS. It also never stages Git changes, commits, pushes, or deploys.

Embedded PDF syntax is intentionally stricter for this profile. `![[paper.pdf#page=N&rect=x1,y1,x2,y2|caption]]` is rendered at the manifest-pinned PDF++ scale into a responsive WebP crop that links to the original page. A PDF embed without a valid rectangle is a hard staging error; ordinary non-embedded PDF links remain normal links. The crop filename includes the PDF content and rendering contract, so changed papers do not reuse stale browser caches. Mutable CSS, reader entrypoints, scene JSON, and the search index carry the acoustic build's Git revision in their URLs; the staged `_headers` file also forces those entrypoints to revalidate after each manual deployment.

If REPORT links intentionally change, inspect the target note first, then edit `approvedDirectLinks` manually and rerun the preview. Never add a command that automatically refreshes this approval list.

## Read-only Excalidraw implementation

- `scripts/stage-acoustic-site.mjs` decompresses Obsidian Excalidraw JSON, resolves embedded files, renders embedded LaTeX to self-contained MathJax SVG data, rewrites approved links, and removes links to unapproved detail notes.
- Scene JSON is stored under `sites/acoustic/content/assets/scenes/`; raster files remain separate so Git diffs and large-file handling are clearer.
- `viewer/excalidraw-reader.tsx` uses `@excalidraw/excalidraw` in controlled view mode. Every drawing page opens in a page-level immersive viewport, exits with `Esc` or the toolbar, and still offers pan/zoom, fit, native-fullscreen fallback, theme synchronization, public links, note excerpts, and in-canvas audio/video readers while disabling load, clear, edit, export, save, and save-as-image controls.
- Published scenes have a single embed contract: `publishedEmbeds`. There is no duplicated media list below a drawing. Note/code embeds use Excalidraw theme variables, and the pan/grab cursors use a two-tone outline that remains visible in both themes.
- `scripts/build-excalidraw-reader.mjs` bundles the React reader to a gitignored `quartz/static/excalidraw-reader/`. The Static emitter intentionally includes generated gitignored assets in the final build.
- Acoustic SPA navigation is disabled so each drawing mount has a simple, deterministic lifecycle. The existing main site keeps SPA navigation.

Read-only is an application/UI contract, not DRM: the browser must receive scene elements to draw them. Do not place secret information in a scene merely because editing controls are hidden.

## Commands and deployment profiles

```powershell
npm run check
npm run build
npm run check:publication
npm run build:acoustic
```

For the existing site, Cloudflare continues using `npm run build` and `public`. The separate acoustic project is a Pages Direct Upload project named `speechproject`, with production branch label `publishing/manual-acoustic-site`, pinned Wrangler 4.123.0, output `public-acoustic`, Node 22+, and canonical host `speechproject.zjnmcp.me`. `QUARTZ_BASE_URL` is only an optional override for temporary previews. Never deploy the acoustic profile under the existing `notes.zjnmcp.me` canonical domain.

Cloudflare does not watch the Git repository. `npm run deploy:acoustic` explicitly checks the committed snapshot, rebuilds it, and uploads it, but does not stage, commit, push, or read the private vault. Keep Git synchronization and public deployment as separate deliberate actions.

## Acceptance checks

- main and acoustic TypeScript/build commands succeed;
- acoustic output contains exactly seven Markdown-derived pages and three scene JSON files;
- every Excalidraw image file ID resolves, and no raw compressed Obsidian drawing appears in Markdown;
- links to `LiSenNet-details` and `DeepFilterNet2-details` are absent from scene link fields;
- drawing pages enter immersive mode from every route; `Esc`, pan, wheel/Ctrl-wheel zoom, fit, fullscreen, theme, internal anchors, and in-canvas audio controls work at desktop and mobile widths;
- REPORT's checked tasks retain their checkboxes without striking out the text, and both PDF++ selections render as theme-adaptive images linked to their exact source pages;
- no blocked directory, credential, generated `public*`, dependency directory, or unrelated private note is staged.
