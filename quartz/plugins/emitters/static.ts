import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    // Generated reader assets are deliberately gitignored, but they still need
    // to be included in the build artifact.
    const includeExcalidrawReader = process.env.QUARTZ_SITE === "acoustic"
    const fps = (await glob("**", staticPath, cfg.configuration.ignorePatterns, false)).filter(
      (fp) => includeExcalidrawReader || !fp.startsWith("excalidraw-reader/"),
    )
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const dest = joinSegments(outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  },
  async *partialEmit() {},
})
