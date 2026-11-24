import fs from "node:fs/promises"
import { createHash } from "node:crypto"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug, QUARTZ, joinSegments } from "../../util/path"
import { BuildCtx } from "../../util/ctx"
import { write } from "./helpers"

export const AstroFinal: QuartzEmitterPlugin = () => ({
  name: "AstroFinal",
  async *emit({ argv }) {
    const directory = joinSegments(QUARTZ, "static", "astro-final")
    const raw = await fs.readFile(joinSegments(directory, "final-data.json"), "utf8")
    const data = JSON.parse(raw)
    const ids = new Set<string>()
    for (const q of data.questions) {
      if (ids.has(q.id) || !q.fragments.length || !q.topics.length) {
        throw new Error(`Invalid astronomy exam question: ${q.id}`)
      }
      ids.add(q.id)
      for (const fragment of q.fragments) {
        await fs.access(joinSegments(directory, fragment.asset))
        await fs.access(joinSegments(directory, fragment.original))
      }
    }
    for (const topic of Object.values(data.topics) as { sources: { asset: string }[] }[]) {
      for (const source of topic.sources) await fs.access(joinSegments(directory, source.asset))
    }
    const [html, app, css] = await Promise.all(
      ["index.html", "app.js", "styles.css"].map((file) =>
        fs.readFile(joinSegments(directory, file), "utf8"),
      ),
    )
    const version = createHash("sha256")
      .update(raw + html + app + css)
      .digest("hex")
      .slice(0, 12)
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "astro-final/final-data" as FullSlug,
      ext: ".js",
      content: `window.__ASTRO_FINAL__=${JSON.stringify(data).replace(/</g, "\\u003c")};`,
    })
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "astro-final/index" as FullSlug,
      ext: ".html",
      content: html.replaceAll("__VERSION__", version),
    })
  },
  async *partialEmit() {},
})
