import { existsSync } from "node:fs"
import path from "node:path"
import { Element, Root } from "hast"
import isAbsoluteUrl from "is-absolute-url"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

const attributeFor: Record<string, string> = {
  a: "href",
  img: "src",
  video: "src",
  audio: "src",
}

function decode(value: string): string {
  try {
    return decodeURI(value)
  } catch {
    return value
  }
}

/**
 * Obsidian resolves `![[assets/x.png]]` against the note's own folder as well as the
 * vault root, whereas Quartz's "shortest" strategy only tries the root. Rewrite a
 * path to its vault-root form when it exists beside the note but not at the root.
 * Must run before CrawlLinks.
 */
export const NoteRelativeLinks: QuartzTransformerPlugin = () => ({
  name: "NoteRelativeLinks",
  htmlPlugins(ctx) {
    const contentRoot = ctx.argv.directory
    const present = (relative: string) =>
      existsSync(path.join(contentRoot, relative)) ||
      existsSync(path.join(contentRoot, `${relative}.md`))

    return [
      () => (tree: Root, file) => {
        const relativePath = file.data.relativePath
        if (!relativePath) return
        const noteDir = path.posix.dirname(relativePath)
        if (noteDir === ".") return

        visit(tree, "element", (node: Element) => {
          const attribute = attributeFor[node.tagName]
          const value = attribute ? node.properties?.[attribute] : undefined
          if (typeof value !== "string" || !value.includes("/")) return
          if (value.startsWith(".") || value.startsWith("#") || value.startsWith("/")) return
          if (isAbsoluteUrl(value, { httpOnly: false })) return

          const hashIndex = value.indexOf("#")
          const target = decode(hashIndex >= 0 ? value.slice(0, hashIndex) : value)
          const fragment = hashIndex >= 0 ? value.slice(hashIndex) : ""
          const candidate = path.posix.join(noteDir, target)
          if (!present(target) && present(candidate)) {
            node.properties[attribute] = `${candidate}${fragment}`
          }
        })
      },
    ]
  },
})
