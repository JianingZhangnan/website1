import { Element, Root } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"

const panels: Record<string, [string, string]> = {
  占据函数怎样随参数变化: ["occupation", "费米占据函数：调节温度与化学势"],
  用费米积分收拢结果: ["integrals", "费米积分：不同阶数与逸度"],
  低温为什么出现阶跃: ["limit", "零温阶跃：固定化学势与固定密度"],
}

// These HTML widgets belong to the website, never to the vault snapshot.
export const FermiVisuals: QuartzTransformerPlugin = () => ({
  name: "FermiVisuals",
  htmlPlugins() {
    return [
      () => (tree: Root, file) => {
        if (file.data.slug !== "统计物理/费米气体") return
        tree.children = tree.children.flatMap((node) => {
          if (node.type !== "element" || node.tagName !== "h2") return [node]
          const panel = panels[toString(node).trim()]
          if (!panel) return [node]
          const [mode, title] = panel
          const iframe: Element = {
            type: "element",
            tagName: "iframe",
            properties: {
              src: `/static/interactive/fermi-dirac.html?mode=${mode}`,
              title,
              loading: "lazy",
              className: ["fpks-fermi-frame"],
              style: "width:100%;height:850px;border:0;display:block;margin:1rem 0",
            },
            children: [],
          }
          return [node, iframe]
        })
      },
    ]
  },
  externalResources() {
    return {
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          script: `
            function syncFermiTheme() {
              const theme = document.documentElement.getAttribute("saved-theme") || "light"
              document.querySelectorAll("iframe.fpks-fermi-frame").forEach(frame => {
                frame.contentWindow?.postMessage({ type: "fpks-fermi-theme", theme }, location.origin)
              })
            }
            window.addEventListener("message", event => {
              if (event.origin !== location.origin || event.data?.type !== "fpks-fermi-height") return
              const frame = Array.from(document.querySelectorAll("iframe.fpks-fermi-frame"))
                .find(frame => frame.contentWindow === event.source)
              if (frame && Number.isFinite(event.data.height)) {
                frame.style.height = Math.max(400, Math.min(1800, event.data.height)) + "px"
              }
            })
            new MutationObserver(syncFermiTheme).observe(document.documentElement, {
              attributes: true, attributeFilter: ["saved-theme"]
            })
            document.addEventListener("nav", syncFermiTheme)
          `,
        },
      ],
    }
  },
})
