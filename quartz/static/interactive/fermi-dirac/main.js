import { loadMath } from "./math.js"
import { mountIntegrals } from "./integrals.js"
import { mountLimit } from "./limit.js"
import * as numerical from "./numerics.js"
const root = document.documentElement,
  embedded = parent !== window
root.dataset.embedded = String(embedded)
const mode = new URLSearchParams(location.search).get("mode") === "limit" ? "limit" : "integrals"
let redraw = () => Promise.resolve()
function resizeFrame() {
  if (embedded)
    parent.postMessage(
      {
        type: "fpks-fermi-height",
        height: Math.ceil(document.body.getBoundingClientRect().height) + 2,
      },
      location.origin,
    )
}
function initialTheme() {
  try {
    if (embedded) return parent.document.documentElement.getAttribute("saved-theme") || "light"
    return localStorage.getItem("theme") || "light"
  } catch {
    return "light"
  }
}
function setTheme(theme) {
  root.dataset.theme = theme
  for (const button of document.querySelectorAll("[data-theme-choice]"))
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme))
}
setTheme(initialTheme())
try {
  await loadMath()
  const app = document.getElementById("app")
  redraw = mode === "limit" ? mountLimit(app) : mountIntegrals(app)
  const bar = document.createElement("div")
  bar.className = "theme-bar"
  bar.innerHTML =
    '<span>配色</span><button data-theme-choice="light">浅色</button><button data-theme-choice="dark">深色</button>'
  if (embedded) bar.hidden = true
  app.prepend(bar)
  const footer = document.createElement("footer")
  footer.innerHTML = '<a target="_blank" rel="noopener">单独打开此图</a>'
  const link = footer.querySelector("a")
  link.href = location.href
  app.append(footer)
  bar.addEventListener("click", (event) => {
    const theme = event.target.closest("[data-theme-choice]")?.dataset.themeChoice
    if (!theme) return
    setTheme(theme)
    try {
      localStorage.setItem("theme", theme)
    } catch {}
    redraw().then(resizeFrame)
  })
  setTheme(root.dataset.theme)
  await redraw()
  app.setAttribute("aria-busy", "false")
  new ResizeObserver(resizeFrame).observe(document.body)
  let previousWidth = innerWidth
  window.addEventListener("resize", () => {
    if (innerWidth !== previousWidth) {
      previousWidth = innerWidth
      redraw().then(resizeFrame)
    }
  })
  window.addEventListener("message", (event) => {
    if (
      event.source === parent &&
      event.origin === location.origin &&
      event.data?.type === "fpks-fermi-theme"
    ) {
      setTheme(event.data.theme)
      redraw().then(resizeFrame)
    }
  })
  window.addEventListener("storage", (event) => {
    if (!embedded && event.key === "theme") {
      setTheme(event.newValue || "light")
      redraw().then(resizeFrame)
    }
  })
  window.fermiMath = numerical
  window.fermiReady = true
} catch (error) {
  document.getElementById("app").textContent = "交互图加载失败，请刷新重试。" + error.message
  console.error(error)
}
