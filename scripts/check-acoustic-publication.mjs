import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

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
}

const sceneFiles = relativeFiles.filter(
  (item) => item.startsWith("assets/scenes/") && item.endsWith(".json"),
)
if (sceneFiles.length !== 3)
  failures.push(`Expected 3 Excalidraw scenes, found ${sceneFiles.length}`)
for (const relative of sceneFiles) {
  const scenePath = path.join(contentRoot, ...relative.split("/"))
  const scene = JSON.parse(await readFile(scenePath, "utf8"))
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
for (const required of [
  "viewModeEnabled={true}",
  "saveToActiveFile: false",
  "saveAsImage: false",
  "export: false",
  "scrollToContent",
  "requestFullscreen",
  "themechange",
]) {
  if (!viewerSource.includes(required))
    failures.push(`Readonly viewer control is missing: ${required}`)
}
if (!viewerStyles.includes("pointer-events: auto !important")) {
  failures.push("Published Excalidraw media/link layers are not interactive")
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
