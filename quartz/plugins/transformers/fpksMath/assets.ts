import fs from "fs"
import path from "path"
import { FilePath, joinSegments } from "../../../util/path"
import { QuartzEmitterPlugin } from "../../types"
import { MATH_ASSET_ROOT, MATH_FONT_PACKAGES, MATH_STYLESHEET, renderStylesheet } from "./engine"

// Writes the shared MathJax stylesheet and copies only the WOFF2 faces it references.
// The fonts come from the pinned npm packages, so no font file enters this repository.
export const FpksMathAssets: QuartzEmitterPlugin = () => ({
  name: "FpksMathAssets",
  async *emit({ argv }) {
    const css: string = await renderStylesheet()

    const stylesheet = joinSegments(argv.output, MATH_STYLESHEET) as FilePath
    await fs.promises.mkdir(path.dirname(stylesheet), { recursive: true })
    await fs.promises.writeFile(stylesheet, css)
    yield stylesheet

    const prefix = MATH_ASSET_ROOT.replace(/[/-]/g, "\\$&")
    const faces = css.matchAll(new RegExp(`${prefix}/([a-z0-9]+)/([\\w.-]+\\.woff2)`, "g"))
    const copied = new Set<string>()
    for (const [url, folder, file] of faces) {
      if (copied.has(url)) continue
      copied.add(url)
      const pkg = MATH_FONT_PACKAGES[folder as keyof typeof MATH_FONT_PACKAGES]
      if (!pkg) throw new Error(`No font package for ${url}`)
      const dest = joinSegments(argv.output, url) as FilePath
      await fs.promises.mkdir(path.dirname(dest), { recursive: true })
      await fs.promises.copyFile(path.join("node_modules", pkg, "chtml", "woff2", file), dest)
      yield dest
    }
  },
  async *partialEmit() {},
})
