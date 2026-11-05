import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/sidebarResize.inline"

export default (() => {
  const SidebarResize: QuartzComponent = () => (
    <div
      class="fpks-sidebar-resize"
      role="separator"
      aria-label="调整知识目录宽度"
      aria-orientation="vertical"
      aria-valuemin={240}
      aria-valuemax={640}
      aria-valuenow={320}
      tabIndex={0}
      title="左右拖动调整目录宽度；双击恢复默认宽度"
    />
  )
  SidebarResize.beforeDOMLoaded = `
    try {
      const width = Number(localStorage.getItem("fpks-sidebar-width"))
      if (Number.isFinite(width) && width >= 240 && width <= 640) {
        document.documentElement.style.setProperty("--fpks-sidebar-width", width + "px")
      }
    } catch {}
  `
  SidebarResize.afterDOMLoaded = script
  return SidebarResize
}) satisfies QuartzComponentConstructor
