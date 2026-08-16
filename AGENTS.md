# FPKS website agent instructions

## Start here

Before changing this repository, read `docs/AI_HANDOFF.md` for architecture/publication boundaries and `docs/DESIGN_BRIEF.md` for visual direction.

## Project boundaries

- This Git repository contains website code and reviewed public snapshots. `D:\BaiduSyncdisk\FPKS` is a private Baidu-Netdisk-synced vault with no Git; never treat it as a website checkout.
- `content/` is the existing public garden snapshot. `sites/acoustic/content/` is the separately generated acoustic-report snapshot.
- Never bulk-copy the vault. Acoustic publication is REPORT plus its manifest-approved direct wikilinks and only their necessary binary dependencies.
- `Language` and `Lauguage` are permanently excluded. Do not weaken the manifest drift check, blocked-segment check, secret scan, file-size limit, or one-hop rule.
- The acoustic snapshot may contain its three approved PDFs and required media. Do not generalize that permission to unrelated vault PDFs or assets.
- Keep `sites/acoustic/content/assets/files/**` in Git LFS. Keep Markdown and scene JSON in regular Git, and route future files above the 24 MiB publication limit to an explicitly approved R2 workflow.
- Keep both profiles static and Cloudflare Pages-compatible. Do not add a server, database, authentication, paid service, or automatic publication without explicit approval.

## Development workflow

```powershell
npm ci
npm run check
npm run build
npm run check:publication
npm run build:acoustic
```

Generated `public/`, `public-acoustic/`, `node_modules/`, and `quartz/static/excalidraw-reader/` are not committed. The reviewed snapshot under `sites/acoustic/content/` is committed intentionally.

## Publishing contract

`npm run stage:acoustic` is read-only. `npm run stage:acoustic -- --apply` is the only normal way to replace the acoustic snapshot and must be preceded by reviewing the preview. If REPORT links differ from `sites/acoustic/publication.json`, stop for manual review; never auto-update the approval list.

`scripts/publish.ps1` has no Git or deployment behavior, scheduled publication is retired, and `scripts/install-scheduled-task.ps1` must continue to refuse installation. `npm run deploy:acoustic` is the only explicit Pages upload entry point; never call it from another script, a Git hook, CI, timer, or watcher. Do not add automatic commit, push, timer, watcher, or deployment actions.

For Excalidraw, preserve true interactive read functions while keeping controlled view mode and all editor/save/export actions disabled. Scene data is public rendering input, so it must never contain secrets.
