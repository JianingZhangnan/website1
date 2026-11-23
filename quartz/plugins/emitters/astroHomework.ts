import fs from "fs"
import { createHash } from "crypto"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import { toHtml } from "hast-util-to-html"
import { fromHtml } from "hast-util-from-html"
import { toString } from "hast-util-to-string"
import { visit } from "unist-util-visit"
import type { Element, ElementContent, Root } from "hast"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug, QUARTZ, joinSegments } from "../../util/path"
import { BuildCtx } from "../../util/ctx"
import { write } from "./helpers"
import { normalizeMathFences } from "../transformers/fpksMath"
import { renderMath } from "../transformers/fpksMath/engine"

type Homework = Record<string, unknown> & {
  prompt?: string
  solution?: string
  kind?: string
  status?: string
  submissions?: { url: string; basis: string }[]
  classification?: {
    category: "homework" | "question"
    evidence: {
      type: "submission-link" | "homework-label" | "question"
      quote: string
      source: { slideDeck: string; slide: number }
    }[]
  }
}

const isMathCode = (node: ElementContent): node is Element =>
  node.type === "element" &&
  node.tagName === "code" &&
  Array.isArray(node.properties.className) &&
  node.properties.className.includes("language-math")

async function renderMathNodes(tree: Root) {
  const targets: {
    parent: { children: unknown[] }
    index: number
    node: Element
    display: boolean
  }[] = []
  visit(tree, "element", (node, index, parent) => {
    if (!parent || index === undefined) return
    if (node.tagName === "pre" && node.children.length === 1 && isMathCode(node.children[0])) {
      targets.push({ parent, index, node: node.children[0], display: true })
    } else if (isMathCode(node)) {
      targets.push({ parent, index, node, display: false })
    }
  })

  for (const { parent, index, node, display } of targets) {
    const source = toString(node)
    const html = await renderMath(source, display)
    parent.children[index] = {
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
}

function normalizeHomeworkDisplayMath(markdown: string) {
  let inCode = false
  return markdown
    .split("\n")
    .flatMap((line) => {
      if (/^\s*(?:```|~~~)/.test(line)) {
        inCode = !inCode
        return [line]
      }
      if (inCode) return [line]
      const match = line.match(/^(\s*(?:>\s*)*(?:(?:[-*+]|\d+\.)\s+)?)(\$\$)(.+?)(\$\$)\s*$/)
      if (!match) return [line]
      const [, prefix, , formula] = match
      return [`${prefix}$$`, `${prefix}${formula}`, `${prefix}$$`]
    })
    .join("\n")
}

async function renderMarkdown(markdown: string) {
  // GFM's bare-URL parser can consume adjacent CJK prose after a URL. Delimit plain URLs
  // explicitly before parsing while leaving existing Markdown links alone.
  const normalizedLinks = markdown.replace(
    /(?<![<\]\(])(https?:\/\/[A-Za-z0-9._~:/?#\[\]@!$&'*+=%,-]+)/g,
    "<$1>",
  )
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkRehype)
  const normalizedMath = normalizeMathFences(normalizeHomeworkDisplayMath(normalizedLinks))
  const tree = processor.runSync(processor.parse(normalizedMath)) as Root
  await renderMathNodes(tree)
  return toHtml(tree)
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")
}

export const AstroHomework: QuartzEmitterPlugin = () => ({
  name: "AstroHomework",
  async *emit({ argv }) {
    const source = joinSegments(QUARTZ, "static", "astro-homework", "homework-data.json")
    const rawData = await fs.promises.readFile(source, "utf8")
    const data = JSON.parse(rawData) as Homework[]
    for (const item of data) {
      const classification = item.classification
      if (
        item.course !== "main" ||
        !classification ||
        !["homework", "question"].includes(classification.category) ||
        !classification.evidence.length ||
        classification.evidence.some(
          (entry) => !entry.quote || !entry.source.slideDeck || !(entry.source.slide > 0),
        )
      ) {
        throw new Error(`Astronomy classification evidence missing or invalid: ${item.id}`)
      }
      const explicitHomework = classification.evidence.some(
        (entry) =>
          (entry.type === "homework-label" && entry.quote.includes("作业")) ||
          (entry.type === "submission-link" &&
            /^https:\/\/box\.nju\.edu\.cn\/u\/d\/[a-z0-9]+\/$/.test(entry.quote) &&
            item.submissions?.some((sub) => sub.basis === "ppt" && sub.url === entry.quote)),
      )
      if (
        (classification.category === "homework" && !explicitHomework) ||
        (classification.category === "question" &&
          classification.evidence.some((entry) => entry.type !== "question"))
      ) {
        throw new Error(`Astronomy classification does not match PPT evidence: ${item.id}`)
      }
    }
    const missingSubmission = data.filter(
      (item) => !Array.isArray(item.submissions) || item.submissions.length === 0,
    )
    if (missingSubmission.length) {
      throw new Error(
        `Homework submission links missing: ${missingSubmission.map((item) => item.id).join(", ")}`,
      )
    }
    const rendered = await Promise.all(
      data.map(async (item) => ({
        ...item,
        promptHtml: await renderMarkdown(String(item.prompt ?? "")),
        solutionHtml:
          item.status === "open" ? "" : await renderMarkdown(String(item.solution ?? "")),
      })),
    )
    const script = `window.__ASTRO_HOMEWORK__=${safeJson(rendered)};`
    if (Buffer.byteLength(script, "utf8") >= 24 * 1024 * 1024) {
      throw new Error("Astro homework payload exceeds the 24 MiB deployment safety limit")
    }
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "astro-homework/homework-data" as FullSlug,
      ext: ".js",
      content: script,
    })

    const app = await fs.promises.readFile(
      joinSegments(QUARTZ, "static", "astro-homework", "app.js"),
      "utf8",
    )
    const styles = await fs.promises.readFile(
      joinSegments(QUARTZ, "static", "astro-homework", "styles.css"),
      "utf8",
    )
    const shell = (
      await fs.promises.readFile(
        joinSegments(QUARTZ, "static", "astro-homework", "index.html"),
        "utf8",
      )
    )
      .replace("__DATA_VERSION__", createHash("sha256").update(rawData).digest("hex").slice(0, 12))
      .replace("__APP_VERSION__", createHash("sha256").update(app).digest("hex").slice(0, 12))
      .replace("__STYLE_VERSION__", createHash("sha256").update(styles).digest("hex").slice(0, 12))
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "astro-homework/index" as FullSlug,
      ext: ".html",
      content: shell,
    })

    // The answers can reference locally generated figures with `figures/<name>.png`.
    // Mirror those files beside the root-level page instead of exposing a second URL shape.
    for (const folder of ["figures", "downloads"]) {
      const directory = joinSegments(QUARTZ, "static", "astro-homework", folder)
      const entries = await fs.promises.readdir(directory, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isFile()) continue
        yield write({
          ctx: { argv } as BuildCtx,
          slug: `astro-homework/${folder}/${entry.name}` as FullSlug,
          ext: "",
          content: await fs.promises.readFile(joinSegments(directory, entry.name)),
        })
      }
    }
  },
  async *partialEmit() {},
})
