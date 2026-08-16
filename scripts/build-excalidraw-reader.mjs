import { rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(repoRoot, "quartz", "static", "excalidraw-reader")

await rm(output, { recursive: true, force: true })
await build({
  entryPoints: [path.join(repoRoot, "viewer", "excalidraw-reader.tsx")],
  outdir: output,
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  sourcemap: false,
  entryNames: "reader",
  chunkNames: "chunks/[name]-[hash]",
  assetNames: "assets/[name]-[hash]",
  conditions: ["production", "browser"],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  loader: {
    ".woff2": "file",
  },
  logLevel: "info",
})
