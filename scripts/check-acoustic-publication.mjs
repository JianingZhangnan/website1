import { execFile } from "node:child_process"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"

const execFileAsync = promisify(execFile)

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const siteRoot = path.join(repoRoot, "sites", "acoustic")
const contentRoot = path.join(siteRoot, "content")
const manifest = JSON.parse(await readFile(path.join(siteRoot, "publication.json"), "utf8"))
const blocked = new Set(manifest.blockedPathSegments.map((item) => item.toLocaleLowerCase("en-US")))

async function walk(root) {
  const files = []
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      else if (entry.isFile()) files.push(absolute)
    }
  }
  await visit(root)
  return files
}

const files = await walk(contentRoot)
const relativeFiles = files.map((file) => path.relative(contentRoot, file).replaceAll("\\", "/"))
const relativeKeys = new Set(relativeFiles.map((item) => item.toLocaleLowerCase("en-US")))
const failures = []
const referencedCropKeys = new Set()
const lfsTargetKeys = new Set()

for (const relative of relativeFiles) {
  if (relative.split("/").some((segment) => blocked.has(segment.toLocaleLowerCase("en-US")))) {
    failures.push(`Blocked path segment in output: ${relative}`)
  }
  const info = await stat(path.join(contentRoot, ...relative.split("/")))
  if (info.size >= manifest.maximumAssetBytes) failures.push(`Oversized output file: ${relative}`)
}

const approvedMarkdown = manifest.approvedDirectLinks
  .filter((target) => path.extname(target) === "")
  .map((target) => `${path.posix.basename(target)}.md`)
const expectedMarkdown = new Set(
  ["index.md", ...approvedMarkdown].map((item) => item.toLocaleLowerCase("en-US")),
)
const actualMarkdown = new Set(
  relativeFiles
    .filter((item) => item.endsWith(".md"))
    .map((item) => item.toLocaleLowerCase("en-US")),
)
for (const expected of expectedMarkdown) {
  if (!actualMarkdown.has(expected)) failures.push(`Approved Markdown page is missing: ${expected}`)
}
for (const actual of actualMarkdown) {
  if (!expectedMarkdown.has(actual))
    failures.push(`Unexpected Markdown page (second-hop leak): ${actual}`)
}

for (const relative of relativeFiles.filter((item) => item.endsWith(".md"))) {
  const markdown = await readFile(path.join(contentRoot, ...relative.split("/")), "utf8")
  if (/```compressed-json|excalidraw-plugin:\s*parsed/i.test(markdown))
    failures.push(`Raw Obsidian drawing payload leaked: ${relative}`)
  if (/\[\[(?:Language|Lauguage)(?:\/|\]\])/i.test(markdown))
    failures.push(`Blocked note link leaked: ${relative}`)
  if (/!\[\[[^\]]+\.pdf(?:#[^\]]*)?\]\]/i.test(markdown))
    failures.push(`Embedded PDF was not converted to a static crop: ${relative}`)

  for (const match of markdown.matchAll(
    /<figure class="[^"]*pdf-plus-crop[^"]*"[\s\S]*?<\/figure>/g,
  )) {
    const figure = match[0]
    const source = figure.match(/data-pdf-source="([^"]+)"/)?.[1]
    const page = figure.match(/data-pdf-page="(\d+)"/)?.[1]
    const image = figure.match(/<img[^>]+src="\.\/([^"]+)"/)?.[1]
    const link = figure.match(/<a[^>]+href="\.\/([^"#]+)#page=(\d+)"/)?.slice(1)
    if (!source || !page || !image || !link) {
      failures.push(`${relative}: malformed PDF++ crop figure`)
      continue
    }
    const imageKey = decodeURI(image).toLocaleLowerCase("en-US")
    const sourceKey = decodeURI(source).toLocaleLowerCase("en-US")
    const linkKey = decodeURI(link[0]).toLocaleLowerCase("en-US")
    if (!imageKey.startsWith("assets/files/generated/pdf-plus/") || !imageKey.endsWith(".webp")) {
      failures.push(`${relative}: invalid PDF++ crop path ${image}`)
    }
    if (!sourceKey.endsWith(".pdf") || sourceKey !== linkKey || page !== link[1]) {
      failures.push(`${relative}: PDF++ crop source/page link does not match its metadata`)
    }
    if (!relativeKeys.has(imageKey)) failures.push(`${relative}: missing PDF++ crop ${image}`)
    if (!relativeKeys.has(sourceKey)) failures.push(`${relative}: missing source PDF ${source}`)
    referencedCropKeys.add(imageKey)
    lfsTargetKeys.add(imageKey)
    lfsTargetKeys.add(sourceKey)
  }
}

const generatedCropKeys = new Set(
  relativeFiles
    .filter((item) => item.startsWith("assets/files/generated/pdf-plus/") && item.endsWith(".webp"))
    .map((item) => item.toLocaleLowerCase("en-US")),
)
for (const key of generatedCropKeys) {
  if (!referencedCropKeys.has(key)) failures.push(`Unreferenced generated PDF++ crop: ${key}`)
}
for (const key of referencedCropKeys) {
  if (!generatedCropKeys.has(key)) failures.push(`Referenced PDF++ crop is not generated: ${key}`)
}

const sceneFiles = relativeFiles.filter(
  (item) => item.startsWith("assets/scenes/") && item.endsWith(".json"),
)
if (sceneFiles.length !== 3)
  failures.push(`Expected 3 Excalidraw scenes, found ${sceneFiles.length}`)
for (const relative of sceneFiles) {
  const scenePath = path.join(contentRoot, ...relative.split("/"))
  const scene = JSON.parse(await readFile(scenePath, "utf8"))
  if (Object.hasOwn(scene, "media")) failures.push(`${relative}: obsolete media list is present`)
  const filesById = scene.files ?? {}
  const sourcesById = scene.fileSources ?? {}
  for (const element of scene.elements ?? []) {
    if (element.type === "image" && !filesById[element.fileId] && !sourcesById[element.fileId]) {
      failures.push(`${relative}: image ${element.id} has no published file ${element.fileId}`)
    }
    if (
      typeof element.link === "string" &&
      (/\[\[/.test(element.link) || /(?:LiSenNet|DeepFilterNet2)-details/i.test(element.link))
    ) {
      failures.push(`${relative}: private or unresolved element link ${element.link}`)
    }
  }
  for (const source of Object.values(sourcesById)) {
    const target = path.resolve(path.dirname(scenePath), source.href)
    const targetRelative = path
      .relative(contentRoot, target)
      .replaceAll("\\", "/")
      .toLocaleLowerCase("en-US")
    if (targetRelative.startsWith("../") || !relativeKeys.has(targetRelative))
      failures.push(`${relative}: missing scene asset ${source.href}`)
  }
  for (const embed of Object.values(scene.publishedEmbeds ?? {})) {
    if (/^(?:\.\/|\/)/.test(embed.href) && embed.href.includes("/assets/")) {
      const targetKey = embed.href
        .replace(/^\.\//, "")
        .replace(/[?#].*$/, "")
        .toLocaleLowerCase("en-US")
      if (!relativeKeys.has(targetKey))
        failures.push(`${relative}: missing embedded media ${embed.href}`)
    }
  }
}

const viewerSource = await readFile(path.join(repoRoot, "viewer", "excalidraw-reader.tsx"), "utf8")
const viewerStyles = await readFile(path.join(repoRoot, "viewer", "excalidraw-reader.css"), "utf8")
const readerComponent = await readFile(
  path.join(repoRoot, "quartz", "components", "ReadonlyExcalidraw.tsx"),
  "utf8",
)
const renderPageSource = await readFile(
  path.join(repoRoot, "quartz", "components", "renderPage.tsx"),
  "utf8",
)
const runSiteSource = await readFile(path.join(repoRoot, "scripts", "run-site.mjs"), "utf8")
const baseStyles = await readFile(path.join(repoRoot, "quartz", "styles", "base.scss"), "utf8")
for (const required of [
  "viewModeEnabled={true}",
  "saveToActiveFile: false",
  "saveAsImage: false",
  "export: false",
  "scrollToContent",
  "requestFullscreen",
  "themechange",
  'host.dataset.excalidrawImmersive === "true"',
  'event.key !== "Escape"',
]) {
  if (!viewerSource.includes(required))
    failures.push(`Readonly viewer control is missing: ${required}`)
}
if (!viewerStyles.includes("pointer-events: auto !important")) {
  failures.push("Published Excalidraw media/link layers are not interactive")
}
if (viewerSource.includes("reader-media-list") || viewerStyles.includes("reader-media-list")) {
  failures.push("Standalone Excalidraw media list has not been removed")
}
for (const required of [
  "--reader-pan-cursor",
  "--reader-grabbing-cursor",
  "--island-bg-color",
  "--color-surface-low",
  "--text-primary-color",
]) {
  if (!viewerStyles.includes(required))
    failures.push(`Readonly viewer style is missing: ${required}`)
}
if (!readerComponent.includes('data-excalidraw-immersive="true"')) {
  failures.push("Excalidraw pages are not configured to open immersively")
}
if (
  !readerComponent.includes("versionedReaderAsset") ||
  !renderPageSource.includes("versionedCoreAsset") ||
  !runSiteSource.includes("QUARTZ_ASSET_VERSION")
) {
  failures.push("Mutable acoustic assets are not revision-versioned")
}
for (const required of ["acoustic-report", "pdf-plus-crop", "pdf-plus-theme-adapt"]) {
  if (!baseStyles.includes(required)) failures.push(`Acoustic report style is missing: ${required}`)
}

const indexMarkdown = await readFile(path.join(contentRoot, "index.md"), "utf8")
if (!/cssclasses:\s*\["acoustic-report"\]/.test(indexMarkdown)) {
  failures.push("Acoustic report does not carry its scoped task-list class")
}

if (!relativeKeys.has("_headers")) {
  failures.push("Cloudflare cache revalidation rules are missing")
} else {
  const headers = await readFile(path.join(contentRoot, "_headers"), "utf8")
  const pageRoutes = relativeFiles
    .filter((relative) => relative.endsWith(".md"))
    .map((relative) =>
      relative === "index.md" ? "/" : `/${relative.slice(0, -3).replaceAll(" ", "-")}`,
    )
  for (const required of [
    ...pageRoutes,
    "/index.css",
    "/static/contentIndex.json",
    "/static/excalidraw-reader/reader.css",
    "/static/excalidraw-reader/reader.js",
    "/assets/scenes/*",
    "max-age=0, must-revalidate",
  ]) {
    if (!headers.includes(required)) failures.push(`Cloudflare headers are missing: ${required}`)
  }
}

for (const key of lfsTargetKeys) {
  const repoRelative = path.posix.join("sites", "acoustic", "content", key)
  try {
    const { stdout } = await execFileAsync("git", ["check-attr", "filter", "--", repoRelative], {
      cwd: repoRoot,
      windowsHide: true,
    })
    if (!stdout.trim().endsWith(": lfs")) {
      failures.push(`Published binary is not covered by Git LFS: ${repoRelative}`)
    }
  } catch (error) {
    failures.push(`Could not verify Git LFS for ${repoRelative}: ${error.message}`)
  }
}

if (failures.length) {
  console.error(
    `Acoustic publication check failed (${failures.length}):\n${failures.map((item) => `  - ${item}`).join("\n")}`,
  )
  process.exit(1)
}

const totalBytes = (await Promise.all(files.map((file) => stat(file)))).reduce(
  (sum, item) => sum + item.size,
  0,
)
console.log(
  `Acoustic publication is bounded and complete: ${actualMarkdown.size} pages, ${sceneFiles.length} interactive scenes, ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB.`,
)
