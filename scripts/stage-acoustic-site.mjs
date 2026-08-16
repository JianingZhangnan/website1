import { copyFile, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import { existsSync, realpathSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import LZString from "lz-string"
import { mathjax } from "mathjax-full/js/mathjax.js"
import { TeX } from "mathjax-full/js/input/tex.js"
import { SVG } from "mathjax-full/js/output/svg.js"
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js"
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js"
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicationRoot = path.join(repoRoot, "sites", "acoustic")
const outputRoot = path.join(publicationRoot, "content")
const manifestPath = path.join(publicationRoot, "publication.json")

const argv = process.argv.slice(2)
let apply = false
let requestedVault = process.env.FPKS_VAULT || ""
for (let index = 0; index < argv.length; index += 1) {
  const value = argv[index]
  if (value === "--apply") apply = true
  else if (value === "--vault") requestedVault = argv[++index] ?? ""
  else if (value.startsWith("--vault=")) requestedVault = value.slice("--vault=".length)
  else if (value === "--help" || value === "-h") {
    console.log(
      `Usage: node scripts/stage-acoustic-site.mjs [--vault PATH] [--apply]\n\nWithout --apply, this command performs a read-only publication preview.`,
    )
    process.exit(0)
  } else {
    throw new Error(`Unknown argument: ${value}`)
  }
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
const vaultCandidates = [requestedVault, "D:\\BaiduSyncdisk\\FPKS", "D:\\learn\\FPKS"].filter(
  Boolean,
)
const vaultRoot = vaultCandidates
  .map((candidate) => path.resolve(candidate))
  .find((candidate) => existsSync(candidate))
if (!vaultRoot) {
  throw new Error(
    `FPKS vault not found. Tried:\n${vaultCandidates.map((item) => `  - ${item}`).join("\n")}`,
  )
}

const reportPath = path.resolve(vaultRoot, manifest.source)
const acousticRoot = path.dirname(reportPath)
if (!existsSync(reportPath)) throw new Error(`REPORT.md not found: ${reportPath}`)

const blockedSegments = new Set(
  manifest.blockedPathSegments.map((item) => item.toLocaleLowerCase("en-US")),
)
const allowedAssetExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".wav",
  ".mp3",
  ".ogg",
  ".m4a",
  ".flac",
  ".mp4",
  ".webm",
  ".mov",
])
const mimeTypes = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".pdf", "application/pdf"],
  [".wav", "audio/wav"],
  [".mp3", "audio/mpeg"],
  [".ogg", "audio/ogg"],
  [".m4a", "audio/mp4"],
  [".flac", "audio/flac"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".mov", "video/quicktime"],
])

const normalizeSlashes = (value) => value.replaceAll("\\", "/")
const normalizeKey = (value) => normalizeSlashes(value).normalize("NFC").toLocaleLowerCase("en-US")
const isInside = (parent, child) => {
  const relative = path.relative(parent, child)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function assertSafeSource(sourcePath) {
  const absolute = path.resolve(sourcePath)
  if (!isInside(vaultRoot, absolute))
    throw new Error(`Source escapes the FPKS vault: ${sourcePath}`)
  const relative = path.relative(vaultRoot, absolute)
  for (const segment of relative.split(path.sep)) {
    if (blockedSegments.has(segment.toLocaleLowerCase("en-US"))) {
      throw new Error(`Blocked publication path segment '${segment}': ${relative}`)
    }
  }
  const real = realpathSync(absolute)
  const realAcousticRoot = realpathSync(acousticRoot)
  if (!isInside(realAcousticRoot, real)) throw new Error(`Source escapes 声学项目: ${sourcePath}`)
}

async function walkFiles(root) {
  const result = []
  const visit = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name)
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) await visit(absolute)
      else if (entry.isFile()) result.push(absolute)
    }
  }
  await visit(root)
  return result
}

const allAcousticFiles = await walkFiles(acousticRoot)
const basenameIndex = new Map()
const stemIndex = new Map()
for (const file of allAcousticFiles) {
  const basename = normalizeKey(path.basename(file))
  const stem = normalizeKey(path.basename(file, path.extname(file)))
  basenameIndex.set(basename, [...(basenameIndex.get(basename) ?? []), file])
  stemIndex.set(stem, [...(stemIndex.get(stem) ?? []), file])
}

function splitWikiInner(inner) {
  const pipe = inner.indexOf("|")
  const targetAndFragment = (pipe === -1 ? inner : inner.slice(0, pipe)).trim()
  const alias = pipe === -1 ? "" : inner.slice(pipe + 1).trim()
  const hash = targetAndFragment.indexOf("#")
  return {
    target: (hash === -1 ? targetAndFragment : targetAndFragment.slice(0, hash)).trim(),
    fragment: hash === -1 ? "" : targetAndFragment.slice(hash),
    alias,
  }
}

function extractWikiLinks(markdown) {
  const links = []
  const pattern = /!?\[\[([^\]]+)\]\]/g
  for (const match of markdown.matchAll(pattern)) links.push(splitWikiInner(match[1]))
  return links
}

function findExistingCandidate(candidate, hasExtension) {
  const variants = hasExtension ? [candidate] : [`${candidate}.md`, candidate]
  for (const variant of variants) {
    if (existsSync(variant) && statSync(variant).isFile()) return path.resolve(variant)
  }
  return null
}

function resolveWikiTarget(target, fromFile) {
  if (!target) return path.resolve(fromFile)
  if (/^[a-z][a-z\d+.-]*:/i.test(target)) return null

  const normalizedTarget = normalizeSlashes(target).replace(/^\/+/, "")
  const hasExtension = path.extname(normalizedTarget) !== ""
  const nativeTarget = normalizedTarget.split("/").join(path.sep)
  const candidates = []
  if (normalizeKey(normalizedTarget).startsWith(`${normalizeKey(path.basename(vaultRoot))}/`)) {
    candidates.push(path.resolve(path.dirname(vaultRoot), nativeTarget))
  }
  if (normalizeKey(normalizedTarget).startsWith("声学项目/")) {
    candidates.push(path.resolve(vaultRoot, nativeTarget))
  }
  candidates.push(path.resolve(path.dirname(fromFile), nativeTarget))
  candidates.push(path.resolve(acousticRoot, nativeTarget))

  for (const candidate of candidates) {
    const found = findExistingCandidate(candidate, hasExtension)
    if (found) {
      assertSafeSource(found)
      return found
    }
  }

  const basename = path.posix.basename(normalizedTarget)
  const matches = hasExtension
    ? basenameIndex.get(normalizeKey(basename))
    : stemIndex.get(normalizeKey(basename))
  if (!matches || matches.length === 0)
    throw new Error(`Cannot resolve [[${target}]] from ${path.relative(vaultRoot, fromFile)}`)
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous [[${target}]] from ${path.relative(vaultRoot, fromFile)}:\n${matches.map((item) => `  - ${path.relative(vaultRoot, item)}`).join("\n")}`,
    )
  }
  assertSafeSource(matches[0])
  return matches[0]
}

const reportMarkdown = await readFile(reportPath, "utf8")
const directTargets = [
  ...new Set(
    extractWikiLinks(reportMarkdown)
      .map((item) => item.target)
      .filter(Boolean),
  ),
]
const approvedTargets = [...new Set(manifest.approvedDirectLinks)]
const directByKey = new Map(directTargets.map((item) => [normalizeKey(item), item]))
const approvedByKey = new Map(approvedTargets.map((item) => [normalizeKey(item), item]))
const unapproved = [...directByKey]
  .filter(([key]) => !approvedByKey.has(key))
  .map(([, value]) => value)
const missingFromReport = [...approvedByKey]
  .filter(([key]) => !directByKey.has(key))
  .map(([, value]) => value)
if (unapproved.length || missingFromReport.length) {
  const lines = ["REPORT.md and the manual approval manifest differ. Review before publishing."]
  if (unapproved.length)
    lines.push(
      `New/unapproved REPORT links:\n${unapproved.map((item) => `  + ${item}`).join("\n")}`,
    )
  if (missingFromReport.length)
    lines.push(
      `Approved links no longer in REPORT:\n${missingFromReport.map((item) => `  - ${item}`).join("\n")}`,
    )
  throw new Error(lines.join("\n"))
}

const selectedNotes = new Set([path.resolve(reportPath)])
const directlyLinkedFiles = new Set()
for (const link of extractWikiLinks(reportMarkdown)) {
  if (!link.target) continue
  const resolved = resolveWikiTarget(link.target, reportPath)
  if (!resolved) continue
  if (path.extname(resolved).toLocaleLowerCase("en-US") === ".md") selectedNotes.add(resolved)
  else directlyLinkedFiles.add(resolved)
}

const noteOutputs = new Map([[path.resolve(reportPath), "index.md"]])
const usedNoteNames = new Map([[normalizeKey("index.md"), reportPath]])
for (const note of selectedNotes) {
  if (note === path.resolve(reportPath)) continue
  const outputName = path.basename(note)
  const key = normalizeKey(outputName)
  if (usedNoteNames.has(key)) throw new Error(`Published note filename collision: ${outputName}`)
  usedNoteNames.set(key, note)
  noteOutputs.set(note, outputName)
}

const assetOutputs = new Map()
function registerAsset(source) {
  const absolute = path.resolve(source)
  assertSafeSource(absolute)
  const extension = path.extname(absolute).toLocaleLowerCase("en-US")
  if (!allowedAssetExtensions.has(extension))
    throw new Error(`Asset type is not publishable: ${path.relative(acousticRoot, absolute)}`)
  const size = statSync(absolute).size
  if (size >= manifest.maximumAssetBytes)
    throw new Error(`Asset exceeds ${manifest.maximumAssetBytes} bytes: ${absolute}`)
  const relative = normalizeSlashes(path.relative(acousticRoot, absolute))
  if (relative.startsWith("../")) throw new Error(`Asset is outside 声学项目: ${absolute}`)
  const output = path.posix.join("assets", "files", relative)
  for (const segment of output.split("/")) {
    if (blockedSegments.has(segment.toLocaleLowerCase("en-US")))
      throw new Error(`Blocked output path: ${output}`)
  }
  assetOutputs.set(absolute, output)
  return output
}
for (const file of directlyLinkedFiles) registerAsset(file)

function markdownTargetFor(note) {
  return noteOutputs.get(note).replace(/\.md$/i, "")
}

function quartzSlugFor(note) {
  return markdownTargetFor(note)
    .split("/")
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent-")
        .replace(/[?#]/g, ""),
    )
    .join("/")
}

function anchorSlug(fragment) {
  if (!fragment) return ""
  const value = fragment.slice(1).trim()
  if (value.startsWith("^")) return `#${encodeURIComponent(value)}`
  return `#${encodeURIComponent(value.toLocaleLowerCase("en-US").replace(/\s+/g, "-"))}`
}

function pageHref(note, fragment = "") {
  return `./${encodeURI(quartzSlugFor(note))}${anchorSlug(fragment)}`
}

const warnings = []
function transformWikilinks(markdown, fromFile, strict) {
  return markdown.replace(/(!?)\[\[([^\]]+)\]\]/g, (_whole, embed, inner) => {
    const parsed = splitWikiInner(inner)
    let resolved
    try {
      resolved = resolveWikiTarget(parsed.target, fromFile)
    } catch (error) {
      if (strict) throw error
      warnings.push(error.message)
      return parsed.alias || parsed.target
    }
    if (!resolved) return parsed.alias || parsed.target

    const extension = path.extname(resolved).toLocaleLowerCase("en-US")
    if (extension === ".md") {
      if (!selectedNotes.has(resolved)) {
        warnings.push(
          `Removed second-hop note link: ${path.relative(vaultRoot, fromFile)} -> ${parsed.target}`,
        )
        return parsed.alias || parsed.target
      }
      const target = markdownTargetFor(resolved)
      return `${embed}[[${target}${parsed.fragment}${parsed.alias ? `|${parsed.alias}` : ""}]]`
    }

    const target = registerAsset(resolved)
    return `${embed}[[${target}${parsed.fragment}${parsed.alias ? `|${parsed.alias}` : ""}]]`
  })
}

function removeFrontmatter(markdown) {
  return markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n/, "")
}

function titleFrontmatter(title, extra = "") {
  return `---\ntitle: ${JSON.stringify(title)}\n${extra}---\n\n`
}

function extractDrawingBody(markdown) {
  return removeFrontmatter(markdown)
    .split(/^# Excalidraw Data\s*$/m)[0]
    .replace(/^==⚠[^\n]*⚠==[^\n]*\r?\n?/m, "")
    .trim()
}

function parseEmbeddedFiles(markdown) {
  const block =
    markdown.match(/^## Embedded Files\s*\r?\n([\s\S]*?)(?:^%%\s*$|^## Drawing\s*$)/m)?.[1] ?? ""
  const mappings = new Map()
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([a-f\d]{40}):\s*(.+?)\s*$/i)
    if (match) mappings.set(match[1], match[2])
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
  const node = mathDocument.convert(tex, { display: true })
  const outer = adaptor.outerHTML(node)
  const svg = outer.match(/<svg[\s\S]*<\/svg>/)?.[0]
  if (!svg) throw new Error(`MathJax did not produce SVG for: ${source}`)
  const colored = svg.replace("<svg ", '<svg color="#1b1b1f" ')
  return `data:image/svg+xml;base64,${Buffer.from(colored).toString("base64")}`
}

function extractSection(noteMarkdown, fragment) {
  let body = extractDrawingBody(noteMarkdown) || removeFrontmatter(noteMarkdown)
  if (fragment) {
    const wanted = fragment.slice(1).trim().toLocaleLowerCase("en-US")
    const lines = body.split(/\r?\n/)
    const start = lines.findIndex((line) => {
      const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/)
      return heading && heading[2].trim().toLocaleLowerCase("en-US") === wanted
    })
    if (start >= 0) {
      const level = lines[start].match(/^(#{1,6})/)?.[1].length ?? 6
      let end = lines.length
      for (let index = start + 1; index < lines.length; index += 1) {
        const heading = lines[index].match(/^(#{1,6})\s+/)
        if (heading && heading[1].length <= level) {
          end = index
          break
        }
      }
      body = lines.slice(start + 1, end).join("\n")
    }
  }
  return body
    .replace(/^```[^\n]*\n/gm, "")
    .replace(/^```\s*$/gm, "")
    .trim()
    .slice(0, 1600)
}

function mediaKind(extension) {
  if (new Set([".wav", ".mp3", ".ogg", ".m4a", ".flac"]).has(extension)) return "audio"
  if (new Set([".mp4", ".webm", ".mov"]).has(extension)) return "video"
  if (new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]).has(extension)) return "image"
  return "link"
}

async function buildDrawing(notePath, markdown) {
  const packed = markdown.match(/```compressed-json\s*([\s\S]*?)```/)?.[1].replace(/\s+/g, "")
  if (!packed) throw new Error(`Compressed Excalidraw data not found: ${notePath}`)
  const decompressed = LZString.decompressFromBase64(packed)
  if (!decompressed) throw new Error(`Cannot decompress Excalidraw data: ${notePath}`)
  const sourceScene = JSON.parse(decompressed)
  const mappings = parseEmbeddedFiles(markdown)
  const elements = sourceScene.elements.map((element) => ({ ...element }))
  const files = { ...(sourceScene.files ?? {}) }
  const fileSources = {}
  const publishedEmbeds = {}
  const media = []
  const mediaSeen = new Set()

  for (const element of elements) {
    if (element.type === "image" && element.fileId) {
      const mapping = mappings.get(element.fileId)
      if (!mapping && !files[element.fileId])
        throw new Error(`Missing embedded file mapping ${element.fileId} in ${notePath}`)
      if (mapping?.startsWith("$$")) {
        files[element.fileId] = {
          id: element.fileId,
          dataURL: formulaDataUrl(mapping),
          mimeType: "image/svg+xml",
          created: 0,
          lastRetrieved: 0,
        }
      } else if (mapping?.startsWith("[[")) {
        const parsed = splitWikiInner(mapping.slice(2, -2))
        const resolved = resolveWikiTarget(parsed.target, notePath)
        const output = registerAsset(resolved)
        const extension = path.extname(resolved).toLocaleLowerCase("en-US")
        fileSources[element.fileId] = {
          href: `../files/${normalizeSlashes(path.relative(acousticRoot, resolved))}`,
          mimeType: mimeTypes.get(extension) ?? "application/octet-stream",
        }
      }
      element.status = "saved"
    }

    if (!element.link) continue
    const wiki = element.link.match(/^\[\[([\s\S]+)\]\]$/)
    if (!wiki) {
      if (/^https?:\/\//i.test(element.link) && element.type === "embeddable") {
        publishedEmbeds[element.id] = { kind: "link", href: element.link, label: "打开外部链接" }
      }
      continue
    }

    const parsed = splitWikiInner(wiki[1])
    let resolved
    try {
      resolved = resolveWikiTarget(parsed.target, notePath)
    } catch (error) {
      warnings.push(error.message)
      element.link = null
      continue
    }
    if (!resolved) {
      element.link = null
      continue
    }

    const extension = path.extname(resolved).toLocaleLowerCase("en-US")
    if (extension === ".md") {
      if (!selectedNotes.has(resolved)) {
        warnings.push(
          `Removed private drawing link: ${path.relative(vaultRoot, notePath)} -> ${parsed.target}`,
        )
        element.link = null
        continue
      }
      const href = pageHref(resolved, parsed.fragment)
      element.link = href
      if (element.type === "embeddable") {
        const targetMarkdown = await readFile(resolved, "utf8")
        publishedEmbeds[element.id] = {
          kind: "note",
          href,
          label: parsed.alias || parsed.fragment.slice(1) || path.basename(resolved, ".md"),
          text: extractSection(targetMarkdown, parsed.fragment),
        }
      }
      continue
    }

    const output = registerAsset(resolved)
    const href = `./${encodeURI(output)}`
    const kind = mediaKind(extension)
    const label = parsed.alias || path.basename(resolved)
    element.link = href
    if (element.type === "embeddable") publishedEmbeds[element.id] = { kind, href, label }
    if ((kind === "audio" || kind === "video") && !mediaSeen.has(href)) {
      mediaSeen.add(href)
      media.push({ kind, href, label })
    }
  }

  const appState = {
    viewBackgroundColor: sourceScene.appState?.viewBackgroundColor ?? "#ffffff",
    gridSize: sourceScene.appState?.gridSize ?? null,
  }
  return {
    scene: {
      type: "excalidraw",
      version: 2,
      source: "FPKS manual acoustic publication",
      elements,
      appState,
      files,
      fileSources,
      publishedEmbeds,
      media,
    },
    body: extractDrawingBody(markdown),
  }
}

const outputs = new Map()
function addText(relative, text) {
  const normalized = normalizeSlashes(relative)
  if (normalized.startsWith("../") || path.isAbsolute(normalized))
    throw new Error(`Unsafe output path: ${relative}`)
  outputs.set(normalized, { type: "text", text })
}
function addCopy(relative, source) {
  const normalized = normalizeSlashes(relative)
  if (normalized.startsWith("../") || path.isAbsolute(normalized))
    throw new Error(`Unsafe output path: ${relative}`)
  const existing = outputs.get(normalized)
  if (existing && existing.source !== source) throw new Error(`Output collision: ${normalized}`)
  outputs.set(normalized, { type: "copy", source })
}

const transformedReport = transformWikilinks(reportMarkdown, reportPath, true)
addText(
  "index.md",
  `${titleFrontmatter("语音增强算法研究报告", 'description: "三种语音增强算法的复现、结构分析与统一测试报告"\n')}${removeFrontmatter(transformedReport).trim()}\n`,
)

for (const notePath of [...selectedNotes].sort((left, right) =>
  left.localeCompare(right, "zh-CN"),
)) {
  if (notePath === path.resolve(reportPath)) continue
  const markdown = await readFile(notePath, "utf8")
  const outputName = noteOutputs.get(notePath)
  const isDrawing =
    /excalidraw-plugin:\s*parsed/i.test(markdown) && /```compressed-json/.test(markdown)
  if (isDrawing) {
    const drawing = await buildDrawing(notePath, markdown)
    const title = path.basename(notePath, ".md")
    const sceneName = `${title}.json`
    const notice =
      "> [!info] 只读互动绘图\n> 可平移、缩放、适应画布、全屏、切换主题并打开公开链接；网页不提供编辑、保存或导出。\n"
    addText(
      outputName,
      `${titleFrontmatter(title, `excalidrawScene: ${JSON.stringify(`assets/scenes/${sceneName}`)}\n`)}${notice}${drawing.body ? `\n${transformWikilinks(drawing.body, notePath, false)}\n` : ""}`,
    )
    addText(path.posix.join("assets", "scenes", sceneName), `${JSON.stringify(drawing.scene)}\n`)
  } else {
    const transformed = transformWikilinks(markdown, notePath, false)
    const body = /^---\s*$/m.test(transformed)
      ? transformed
      : `${titleFrontmatter(path.basename(notePath, ".md"))}${transformed.trim()}\n`
    addText(outputName, body)
  }
}

for (const [source, output] of assetOutputs) addCopy(output, source)

const secretPattern =
  /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|github_pat_[A-Za-z\d_]{20,}|gh[pousr]_[A-Za-z\d]{30,}|sk-[A-Za-z\d]{32,}|(?:api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["'])/i
for (const [relative, entry] of outputs) {
  for (const segment of relative.split("/")) {
    if (blockedSegments.has(segment.toLocaleLowerCase("en-US")))
      throw new Error(`Blocked segment leaked to output: ${relative}`)
  }
  if (entry.type === "text" && secretPattern.test(entry.text))
    throw new Error(`Potential secret in generated output: ${relative}`)
  if (entry.type === "text" && relative.endsWith(".md") && /```compressed-json/.test(entry.text)) {
    throw new Error(`Raw Obsidian Excalidraw payload leaked into Markdown: ${relative}`)
  }
}

const noteList = [...outputs.keys()]
  .filter((item) => item.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b, "zh-CN"))
const assetList = [...outputs.entries()]
  .filter(([, entry]) => entry.type === "copy")
  .map(([relative]) => relative)
  .sort()
console.log(`${apply ? "Applying" : "Previewing"} manual acoustic publication from ${reportPath}`)
console.log(
  `Approved Markdown pages (${noteList.length}):\n${noteList.map((item) => `  - ${item}`).join("\n")}`,
)
console.log(
  `Required binary assets (${assetList.length}):\n${assetList.map((item) => `  - ${item}`).join("\n")}`,
)
if (warnings.length)
  console.log(
    `Publication boundary notes:\n${[...new Set(warnings)].map((item) => `  - ${item}`).join("\n")}`,
  )

if (!apply) {
  console.log(
    "Preview complete. No files were changed. Re-run with --apply after reviewing this list.",
  )
  process.exit(0)
}

if (
  path.resolve(outputRoot) !== path.resolve(publicationRoot, "content") ||
  !isInside(publicationRoot, outputRoot)
) {
  throw new Error(`Refusing to replace unexpected output directory: ${outputRoot}`)
}

const stagingRoot = path.join(publicationRoot, `.content-staging-${process.pid}`)
await rm(stagingRoot, { recursive: true, force: true })
try {
  for (const [relative, entry] of outputs) {
    const destination = path.join(stagingRoot, ...relative.split("/"))
    if (!isInside(stagingRoot, destination))
      throw new Error(`Output escapes staging directory: ${relative}`)
    await mkdir(path.dirname(destination), { recursive: true })
    if (entry.type === "text") await writeFile(destination, entry.text, "utf8")
    else await copyFile(entry.source, destination)
  }

  const stagedFiles = await walkFiles(stagingRoot)
  if (stagedFiles.length !== outputs.size)
    throw new Error(
      `Staged file count mismatch: expected ${outputs.size}, found ${stagedFiles.length}`,
    )
  await rm(outputRoot, { recursive: true, force: true })
  await rename(stagingRoot, outputRoot)
} finally {
  await rm(stagingRoot, { recursive: true, force: true })
}

const totalBytes = (
  await Promise.all(
    [...outputs.keys()].map((relative) => stat(path.join(outputRoot, ...relative.split("/")))),
  )
).reduce((sum, item) => sum + item.size, 0)
console.log(
  `Publication snapshot updated: ${outputs.size} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB.`,
)
console.log("No Git commit, push, or deployment was performed.")
