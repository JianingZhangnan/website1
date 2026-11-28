import { Element, Root } from "hast"
import { QuartzTransformerPlugin } from "../types"

// Embeds the standalone p4mm plane-group interactive visualizer into the orbit-stabilizer note.
export const GroupVisuals: QuartzTransformerPlugin = () => ({
  name: "GroupVisuals",
  htmlPlugins() {
    return [
      () => (tree: Root, file) => {
        if (file.data.slug !== "Group/Final-revise/Note1") return

        const heading: Element = {
          type: "element",
          tagName: "h2",
          properties: { id: "p4mm-interactive" },
          children: [{ type: "text", value: "平面群 p4mm 群元与 Wyckoff 位置交互图" }],
        }

        const iframe: Element = {
          type: "element",
          tagName: "iframe",
          properties: {
            src: "/static/interactive/p4mm-group.html?embed=1",
            title: "平面群 p4mm 群元交互图",
            loading: "lazy",
            className: ["fpks-p4mm-frame"],
            style: "width:100%;height:480px;border:0;display:block;margin:1rem 0",
          },
          children: [],
        }

        tree.children.push(heading, iframe)
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
            function syncP4mmTheme() {
              const theme = document.documentElement.getAttribute("saved-theme") || "light"
              document.querySelectorAll("iframe.fpks-p4mm-frame").forEach(frame => {
                frame.contentWindow?.postMessage({ type: "fpks-p4mm-theme", theme }, location.origin)
              })
            }
            window.addEventListener("message", event => {
              if (event.origin !== location.origin || event.data?.type !== "fpks-p4mm-height") return
              const frame = Array.from(document.querySelectorAll("iframe.fpks-p4mm-frame"))
                .find(frame => frame.contentWindow === event.source)
              if (frame && Number.isFinite(event.data.height)) {
                frame.style.height = Math.max(420, Math.min(1200, event.data.height + 12)) + "px"
              }
            })
            new MutationObserver(syncP4mmTheme).observe(document.documentElement, {
              attributes: true, attributeFilter: ["saved-theme"]
            })
            document.addEventListener("nav", syncP4mmTheme)
          `,
        },
      ],
    }
  },
})
