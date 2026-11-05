import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifest = JSON.parse(
  fs.readFileSync(path.join(repo, "scripts/publish-approved-notes.json"), "utf8"),
)
const contentRoot = path.join(repo, "content")
for (const relative of manifest.notes) {
  // A durable, exact-file authorization; no directory patterns or escaping paths.
  const segments = relative.split("/")
  if (
    segments[0] !== "统计物理" ||
    segments.some((part) => part === ".." || part === "." || part.includes("\\")) ||
    !relative.endsWith(".md")
  ) {
    throw new Error(`Invalid approved note path: ${relative}`)
  }
  const target = path.join(contentRoot, ...segments)
  if (!fs.existsSync(target)) continue // Deleted source notes must not be recreated.
  const source = fs.readFileSync(target, "utf8")
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/)?.[1]
  if (!frontmatter) continue
  if (/^excalidraw-plugin:/m.test(frontmatter)) throw new Error("Cannot approve drawing source")
  if (/^draft:\s*["']?true["']?\s*$/m.test(frontmatter)) {
    // Modify only this YAML property. Preserve all other formatting and markers.
    const result = source.replace(/^(---\r?\n)([\s\S]*?)(\r?\n---)/, (_, open, yaml, close) => {
      return open + yaml.replace(/^draft:\s*["']?true["']?\s*\r?\n?/m, "") + close
    })
    fs.writeFileSync(target, result, "utf8")
  }
}
