# FPKS website engineering handoff

Last updated: 2026-08-16

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

Current approved pages are REPORT plus `GTCRN`, `LiSenNet`, `DeepFilterNet2`, `Data note`, `LiSenNet input`, and `BM and ERB`. The three directly linked papers and 19 required image/audio files are copied under `assets/files/`. That entire directory is Git LFS-tracked; Markdown, scene JSON, and code remain regular Git objects. Every asset is below the 24 MiB Cloudflare file limit. Files that exceed that limit, or large frequently changing datasets, belong in an explicitly approved R2 publication flow rather than Git LFS or the private vault.

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

If REPORT links intentionally change, inspect the target note first, then edit `approvedDirectLinks` manually and rerun the preview. Never add a command that automatically refreshes this approval list.

## Read-only Excalidraw implementation

- `scripts/stage-acoustic-site.mjs` decompresses Obsidian Excalidraw JSON, resolves embedded files, renders embedded LaTeX to self-contained MathJax SVG data, rewrites approved links, and removes links to unapproved detail notes.
- Scene JSON is stored under `sites/acoustic/content/assets/scenes/`; raster files remain separate so Git diffs and large-file handling are clearer.
- `viewer/excalidraw-reader.tsx` uses `@excalidraw/excalidraw` in controlled view mode. It offers pan/zoom, fit, fullscreen, theme synchronization, public links, note excerpts, and audio/video readers while disabling load, clear, edit, export, save, and save-as-image controls.
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
- pan, wheel/Ctrl-wheel zoom, fit, fullscreen, theme, internal anchors, and audio controls work at desktop and mobile widths;
- no blocked directory, credential, generated `public*`, dependency directory, or unrelated private note is staged.
