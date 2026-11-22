import remarkMath from "remark-math"
import { fromHtml } from "hast-util-from-html"
import { toString } from "hast-util-to-string"
import { visit, SKIP } from "unist-util-visit"
import type { Element, ElementContent, Root } from "hast"
import type { VFile } from "vfile"
import { QuartzTransformerPlugin } from "../../types"
import { MATH_STYLESHEET, renderMath } from "./engine"

const hasClass = (node: Element, name: string) =>
  Array.isArray(node.properties?.className) && node.properties.className.includes(name)

const isMathCode = (node: ElementContent | undefined): node is Element =>
  node?.type === "element" && node.tagName === "code" && hasClass(node, "language-math")

// Same DOM as Obsidian's reading view, so the layout rules of the vault's CSS snippets
// apply as they are. `data-latex` is stripped: on every nested node it would repeat the
// source and the fraction macros, and nothing reads it.
async function renderNode(source: string, display: boolean, file: VFile): Promise<Element> {
  const html = (await renderMath(source, display)).replace(/ data-latex="[^"]*"/g, "")
  if (html.includes("<mjx-merror")) {
    console.warn(`Formula error in ${file.data.filePath ?? "unknown file"}: ${source}`)
  }
  return {
    type: "element",
    tagName: display ? "div" : "span",
    properties: {
      className: display ? ["math", "math-block"] : ["math", "math-inline"],
      role: "math",
      ariaLabel: source,
    },
    children: fromHtml(html, { fragment: true }).children as ElementContent[],
  }
}

const LINE_PREFIX = /^(\s*(?:>\s*)*(?:(?:[-*+]|\d+\.)\s+)?)/
const CODE_FENCE = /^\s*(?:>\s*)*(?:```|~~~)/

// remark-math treats text after an opening `$$` as fence metadata and only closes on a
// bare `$$` line. Obsidian accepts both on the formula's own lines, so split them.
export function normalizeMathFences(src: string): string {
  const out: string[] = []
  let inCode = false
  let continuation: string | null = null // line prefix while inside a multi-line formula

  for (const line of src.split("\n")) {
    if (continuation !== null) {
      const body = line.replace(/\r$/, "")
      if (/\$\$\s*$/.test(body)) {
        const content = body.replace(/\$\$\s*$/, "")
        if (content.replace(/^[\s>]*/, "") !== "") out.push(content)
        out.push(`${continuation}$$`)
        continuation = null
      } else {
        out.push(line)
      }
      continue
    }

    if (CODE_FENCE.test(line)) inCode = !inCode
    const prefix = line.match(LINE_PREFIX)?.[1] ?? ""
    const rest = line.slice(prefix.length).replace(/\r$/, "")
    if (inCode || !rest.startsWith("$$")) {
      out.push(line)
      continue
    }

    const after = rest.slice(2)
    if (after.includes("$$")) {
      out.push(line) // complete on one line; remarkDisplayMath turns it into a block
      continue
    }
    continuation = prefix.replace(/[^\s>]/g, " ")
    out.push(`${prefix}$$`)
    if (after.trim() !== "") out.push(`${continuation}${after}`)
  }
  return out.join("\n")
}

const mathBlock = (value: string) => ({
  type: "math",
  meta: null,
  value,
  data: {
    hName: "pre",
    hChildren: [
      {
        type: "element",
        tagName: "code",
        properties: { className: ["language-math", "math-display"] },
        children: [{ type: "text", value }],
      },
    ],
  },
})

// remark-math parses `$$x$$` inside a paragraph as inline math; Obsidian shows it as a block.
function remarkDisplayMath() {
  return (tree: any, file: VFile) => {
    const source = String(file.value)
    const isDouble = (node: any) =>
      node.type === "inlineMath" &&
      node.position &&
      source.startsWith("$$", node.position.start.offset)

    visit(tree, "paragraph", (node: any, index, parent: any) => {
      if (!parent || index === undefined || !node.children.some(isDouble)) return

      const blocks: any[] = []
      let current: any[] = []
      const flush = () => {
        const isBlank = (child: any) => child.type === "text" && child.value.trim() === ""
        if (!current.every(isBlank)) blocks.push({ type: "paragraph", children: current })
        current = []
      }
      for (const child of node.children) {
        if (isDouble(child)) {
          flush()
          blocks.push(mathBlock(child.value))
        } else {
          current.push(child)
        }
      }
      flush()
      parent.children.splice(index, 1, ...blocks)
      return [SKIP, index + blocks.length]
    })
  }
}

function rehypeFpksMath() {
  return async (tree: Root, file: VFile) => {
    const targets: {
      parent: { children: unknown[] }
      index: number
      code: Element
      display: boolean
    }[] = []
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined) return
      if (node.tagName === "pre" && node.children.length === 1 && isMathCode(node.children[0])) {
        targets.push({ parent, index, code: node.children[0], display: true })
        return SKIP
      }
      if (isMathCode(node)) {
        targets.push({ parent, index, code: node, display: hasClass(node, "math-display") })
        return SKIP
      }
    })

    // In order rather than in parallel: the engine shares one MathJax document.
    for (const { parent, index, code, display } of targets) {
      const original = parent.children[index] as Element
      const rendered = await renderNode(toString(code), display, file)
      // A block reference (`^id` after the formula) sits on the node being replaced.
      if (original.properties?.id) rendered.properties.id = original.properties.id
      parent.children[index] = rendered
    }
  }
}

// A rendered formula has no useful text, so copying a selection yields its TeX source.
const copyAsTex = `
if (!window.__fpksMathCopy) {
  window.__fpksMathCopy = true
  const source = (el) => {
    const tex = el.getAttribute("aria-label")
    return el.classList.contains("math-block") ? "$$" + tex + "$$" : "$" + tex + "$"
  }
  document.addEventListener("copy", (event) => {
    const selection = document.getSelection()
    if (!selection || selection.isCollapsed || !selection.rangeCount) return
    const range = selection.getRangeAt(0)
    const anchor = range.commonAncestorContainer
    const start = anchor.nodeType === 1 ? anchor : anchor.parentElement
    const within = start && start.closest(".math[aria-label]")
    let text
    if (within) {
      text = source(within)
    } else {
      const fragment = range.cloneContents()
      const formulas = fragment.querySelectorAll(".math[aria-label]")
      if (!formulas.length) return
      formulas.forEach((el) => el.replaceWith(source(el)))
      text = fragment.textContent
    }
    event.clipboardData.setData("text/plain", text)
    event.preventDefault()
  })
}
`

export const FpksMath: QuartzTransformerPlugin = () => ({
  name: "FpksMath",
  textTransform(_ctx, src) {
    return normalizeMathFences(src)
  },
  markdownPlugins() {
    return [remarkMath, remarkDisplayMath]
  },
  htmlPlugins() {
    return [rehypeFpksMath]
  },
  externalResources() {
    return {
      css: [{ content: MATH_STYLESHEET }],
      js: [{ script: copyAsTex, loadTime: "afterDOMReady", contentType: "inline" }],
    }
  },
})
