import { Root } from "mdast"
import { toString } from "mdast-util-to-string"
import { QuartzTransformerPlugin } from "../types"

/**
 * Obsidian notes usually repeat their filename as the first H1, while Quartz
 * already renders the title in the page header. Remove that H1 only when the
 * text is identical, so headings that add information are never lost.
 */
export const DedupeTitle: QuartzTransformerPlugin = () => ({
  name: "DedupeTitle",
  markdownPlugins() {
    return [
      () => (tree: Root, file) => {
        const title = file.data.frontmatter?.title?.trim()
        if (!title) return

        const index = tree.children.findIndex((node) => node.type === "heading" && node.depth === 1)
        if (index >= 0 && toString(tree.children[index]).trim() === title) {
          tree.children.splice(index, 1)
        }
      },
    ]
  },
})
