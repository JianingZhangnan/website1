// Renders the vault's Excalidraw drawings to static SVG plus a small stub note.
//
//   node export.mjs --vault D:\learn\FPKS --content ..\..\content --dirs Excalidraw,统计物理 [--report out.json]
//
// A drawing is published only if every image and formula it references resolves and the
// export succeeds. Anything else is skipped and reported, never published half-rendered.
import { createHash } from "node:crypto"
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { createServer } from "node:http"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"
import LZString from "lz-string"
import { mathjax } from "mathjax-full/js/mathjax.js"
import { TeX } from "mathjax-full/js/input/tex.js"
import { SVG } from "mathjax-full/js/output/svg.js"
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js"
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js"
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js"
import { chromium } from "playwright-core"

const here = path.dirname(fileURLToPath(import.meta.url))
const RENDERER_VERSION = "1"
const MAX_BYTES = 24 * 1024 * 1024 - 1
const IMAGE_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
}

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : fallback
}

const vault = path.resolve(argument("vault", "D:/learn/FPKS"))
const content = path.resolve(argument("content", path.join(here, "..", "..", "content")))
const dirs = argument("dirs", "").split(",").filter(Boolean)
const reportPath = argument("report")
const cacheRoot =
  argument("cache") ??
  path.join(process.env.LOCALAPPDATA ?? os.tmpdir(), "FPKS-Publish", "excalidraw-cache")
if (!dirs.length) throw new Error("--dirs is required")

async function* walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(root, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const frontmatterOf = (markdown) => markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ""
const isDrawing = (markdown) => /^excalidraw-plugin:/m.test(frontmatterOf(markdown))
const isDraft = (markdown) => /^draft:\s*["']?true["']?\s*$/m.test(frontmatterOf(markdown))
// Vault-relative paths the owner has decided not to publish, whatever the arguments say.
const privateDrawings = new Set(
  JSON.parse(await readFile(path.join(here, "private-drawings.json"), "utf8")),
)
const skipReason = (relative, markdown) => {
  if (privateDrawings.has(relative)) return "private"
  if (isDraft(markdown)) return "draft: true"
  if (/(^|\/)Templates?\//i.test(relative)) return "template"
  if (/(^|\/)DRAFT(\.md$|\/)/i.test(relative)) return "named DRAFT"
  return null
}

// One index of every vault file by name, for resolving `[[Pasted Image x.png]]`.
const vaultFiles = new Map()
for await (const file of walk(vault)) {
  const name = path.basename(file).toLowerCase()
  if (!vaultFiles.has(name)) vaultFiles.set(name, [])
  vaultFiles.get(name).push(file)
}

function resolveImage(target, notePath) {
  const clean = target.split("|")[0].split("#")[0].trim()
  for (const candidate of [path.join(path.dirname(notePath), clean), path.join(vault, clean)]) {
    if (existsSync(candidate)) return candidate
  }
  const matches = vaultFiles.get(path.basename(clean).toLowerCase()) ?? []
  if (!matches.length) return null
  // With duplicates, prefer the copy closest to the drawing.
  const noteDir = path.dirname(notePath)
  return [...matches].sort(
    (a, b) => path.relative(noteDir, a).length - path.relative(noteDir, b).length,
  )[0]
}

function parseEmbeddedFiles(markdown) {
  const block =
    markdown.match(/^## Embedded Files\s*\r?\n([\s\S]*?)(?:^%%\s*$|^## Drawing\s*$)/m)?.[1] ?? ""
  const mappings = new Map()
  let current = null
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([a-f\d]{40}):\s*(.*?)\s*$/i)
    if (match) {
      current = match[1]
      mappings.set(current, match[2])
    } else if (
      current &&
      mappings.get(current).startsWith("$$") &&
      !/\$\$\s*$/.test(mappings.get(current).slice(2))
    ) {
      // A formula can span several lines; keep reading until its closing $$.
      mappings.set(current, `${mappings.get(current)}\n${line}`)
    }
  }
  return mappings
}

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)
const mathDocument = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "none" }),
})

function formulaDataUrl(source) {
  const tex = source.replace(/^\$\$/, "").replace(/\$\$$/, "")
  const svg = adaptor
    .outerHTML(mathDocument.convert(tex, { display: true }))
    .match(/<svg[\s\S]*<\/svg>/)?.[0]
  if (!svg) throw new Error(`MathJax produced no SVG for ${source}`)
  if (svg.includes("data-mjx-error") || svg.includes("merror"))
    throw new Error(`TeX error in ${source}`)
  return `data:image/svg+xml;base64,${Buffer.from(svg.replace("<svg ", '<svg color="#1b1b1f" ')).toString("base64")}`
}

async function loadScene(notePath, markdown) {
  const packed = markdown.match(/```compressed-json\s*([\s\S]*?)```/)?.[1].replace(/\s+/g, "")
  if (!packed) throw new Error("no compressed-json block")
  const json = LZString.decompressFromBase64(packed)
  if (!json) throw new Error("cannot decompress the drawing")
  const scene = JSON.parse(json)
  const mappings = parseEmbeddedFiles(markdown)
  const files = { ...(scene.files ?? {}) }
  const stats = { images: 0, formulas: 0 }
  const seen = new Set()

  for (const element of scene.elements) {
    if (element.isDeleted || element.type !== "image" || !element.fileId) continue
    element.status = "saved"
    if (seen.has(element.fileId)) continue
    seen.add(element.fileId)

    const mapping = mappings.get(element.fileId)
    if (mapping?.startsWith("$$")) {
      files[element.fileId] = {
        id: element.fileId,
        dataURL: formulaDataUrl(mapping),
        mimeType: "image/svg+xml",
        created: 0,
      }
      stats.formulas++
    } else if (mapping?.startsWith("[[")) {
      const target = mapping.slice(2, mapping.indexOf("]]"))
      const file = resolveImage(target, notePath)
      if (!file) throw new Error(`missing image ${target}`)
      const mimeType = IMAGE_TYPES[path.extname(file).toLowerCase()]
      if (!mimeType) throw new Error(`unsupported embed ${target}`)
      files[element.fileId] = {
        id: element.fileId,
        dataURL: `data:${mimeType};base64,${(await readFile(file)).toString("base64")}`,
        mimeType,
        created: 0,
      }
      stats.images++
    } else if (!files[element.fileId]?.dataURL) {
      throw new Error(`unresolved embedded file ${element.fileId}: ${mapping ?? "no mapping"}`)
    }
  }
  return { scene: { elements: scene.elements, appState: scene.appState ?? {}, files }, stats }
}

// ------------------------------------------------------------------ renderer page

const bundleDir = path.join(os.tmpdir(), `fpks-excalidraw-bundle-${RENDERER_VERSION}`)
await build({
  entryPoints: [path.join(here, "page-entry.js")],
  outdir: bundleDir,
  bundle: true,
  format: "esm",
  splitting: true,
  platform: "browser",
  target: ["es2020"],
  minify: true,
  define: { "process.env.NODE_ENV": '"production"', "process.env.IS_PREACT": '"false"' },
  loader: { ".woff2": "file" },
  logLevel: "error",
})
const fontRoot = path.join(
  here,
  "node_modules",
  "@excalidraw",
  "excalidraw",
  "dist",
  "prod",
  "fonts",
)
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname)
  if (url === "/") {
    res.writeHead(200, { "content-type": "text/html" })
    return res.end(
      `<!doctype html><script>window.EXCALIDRAW_ASSET_PATH="/";</script><script type="module" src="/page-entry.js"></script>`,
    )
  }
  const candidates = [path.join(bundleDir, url), path.join(fontRoot, url.replace(/^\/fonts\//, ""))]
  for (const candidate of candidates) {
    if (existsSync(candidate) && (await stat(candidate)).isFile()) {
      const ext = path.extname(candidate)
      const type =
        ext === ".js"
          ? "text/javascript"
          : ext === ".woff2"
            ? "font/woff2"
            : "application/octet-stream"
      res.writeHead(200, { "content-type": type })
      return res.end(await readFile(candidate))
    }
  }
  res.writeHead(404)
  res.end()
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))

const browser = await chromium.launch({ channel: "chrome", headless: true })
const context = await browser.newContext()
const newPage = async () => {
  const page = await context.newPage()
  page.setDefaultTimeout(180000)
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  await page.waitForFunction(() => window.rendererReady === true)
  return page
}
let page = await newPage()

// ------------------------------------------------------------------ main

const titleOf = (relative) => path.posix.basename(relative, ".md").replace(/\.excalidraw$/, "")
const stubFor = (title, svgPath) =>
  [
    "---",
    `title: ${JSON.stringify(title)}`,
    "cssclasses:",
    "  - drawing",
    "---",
    "",
    "手绘画板的静态渲染。点击画面可打开原图，再用浏览器缩放查看细节。",
    "",
    `[![${title}](${svgPath})](${svgPath})`,
    "",
  ].join("\n")

// Drawings under an assets folder would add an `assets` entry to the site's explorer.
const outputBaseFor = (relative) => {
  const stem = relative.replace(/\.md$/, "")
  return /(^|\/)assets\//i.test(stem) ? `Excalidraw/${path.posix.basename(stem)}` : stem
}
// Quartz slugifies asset names, so give the SVG a name that survives unchanged.
const svgPathFor = (base) => `${base.replace(/[\s#?%&]+/g, "-")}.svg`

const written = new Set()
const results = []
for (const dir of dirs) {
  const root = path.join(vault, dir)
  if (!existsSync(root)) continue
  for await (const file of walk(root)) {
    if (!file.endsWith(".md")) continue
    const markdown = await readFile(file, "utf8")
    if (!isDrawing(markdown)) continue
    const relative = path.relative(vault, file).split(path.sep).join("/")
    const reason = skipReason(relative, markdown)
    if (reason) {
      results.push({ relative, status: "skipped", reason })
      continue
    }

    const base = outputBaseFor(relative)
    const svgPath = svgPathFor(base)
    const svgOut = path.join(content, svgPath)
    const stubOut = path.join(content, `${base}.md`)
    try {
      const { scene, stats } = await loadScene(file, markdown)
      if (!scene.elements.some((element) => !element.isDeleted)) {
        await rm(svgOut, { force: true })
        await rm(stubOut, { force: true })
        results.push({ relative, status: "skipped", reason: "empty" })
        continue
      }
      const hash = createHash("sha256")
        .update(RENDERER_VERSION)
        .update(JSON.stringify(scene))
        .digest("hex")
        .slice(0, 32)
      const cached = path.join(cacheRoot, `${hash}.svg`)
      let elements = null
      if (!existsSync(cached)) {
        const rendered = await page.evaluate((payload) => window.renderScene(payload), scene)
        if (!rendered.svg.startsWith("<svg")) throw new Error("renderer returned no SVG")
        elements = rendered.count
        await mkdir(cacheRoot, { recursive: true })
        await writeFile(cached, rendered.svg)
      }
      const bytes = (await stat(cached)).size
      if (bytes > MAX_BYTES) throw new Error(`SVG is ${bytes} bytes, over the publish limit`)
      await mkdir(path.dirname(svgOut), { recursive: true })
      await copyFile(cached, svgOut)
      await writeFile(stubOut, stubFor(titleOf(relative), svgPath))
      written.add(path.resolve(svgOut))
      written.add(path.resolve(stubOut))
      results.push({ relative, status: "ok", bytes, elements, ...stats })
      console.log(`ok   ${relative} (${(bytes / 1048576).toFixed(1)} MB)`)
    } catch (error) {
      // Never leave a stale render behind for a drawing that no longer exports.
      await rm(svgOut, { force: true })
      await rm(stubOut, { force: true })
      results.push({
        relative,
        status: "failed",
        reason: String(error.message ?? error).slice(0, 300),
      })
      console.log(`FAIL ${relative}: ${String(error.message ?? error).slice(0, 200)}`)
      await page.close().catch(() => {})
      page = await newPage()
    }
  }
}

await browser.close()
server.close()

// content/Excalidraw only ever holds this tool's output. Prune it last, so a crash above
// leaves the previously published drawings in place.
const generatedRoot = path.join(content, "Excalidraw")
if (existsSync(generatedRoot)) {
  for await (const file of walk(generatedRoot)) {
    if (!written.has(path.resolve(file))) await rm(file, { force: true })
  }
}

if (reportPath) await writeFile(reportPath, JSON.stringify(results, null, 2))
const count = (status) => results.filter((result) => result.status === status).length
console.log(`exported=${count("ok")} skipped=${count("skipped")} failed=${count("failed")}`)
