import { QuartzTransformerPlugin } from "../types"

const STYLESHEET = "https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap"

/**
 * Loads the handwritten Chinese face used by the left rail. Quartz's theme config
 * only takes header, body and code fonts, so this one is declared separately.
 */
export const NavFont: QuartzTransformerPlugin = () => ({
  name: "NavFont",
  externalResources() {
    return { css: [{ content: STYLESHEET }] }
  },
})
