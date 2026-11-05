import { math, el } from "./math.js"
let revision
const names = { zoom: "框选放大", pan: "拖动平移" }
export function chartShell() {
  return `<div class="toolbar"><button data-tool="zoom" aria-pressed="true">框选放大</button><button data-tool="pan" aria-pressed="false">拖动平移</button><button data-tool="reset">复位视图</button><span class="hint">滚轮缩放 · 双击复位</span></div><div class="graph"><div id="plot" class="plot" role="img" aria-label="可缩放的费米函数曲线"></div><span id="axis-y" class="axis-label axis-y"></span><span id="axis-x" class="axis-label axis-x"></span></div>`
}
export function color(index) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(["--blue", "--green", "--accent", "--purple"][index])
    .trim()
}
export const colorVariable = (index) =>
  `var(${["--blue", "--green", "--accent", "--purple"][index]})`
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
export async function plot(traces, { key, xrange, logy = false, xlabel, ylabel }) {
  const same = revision === key
  revision = key
  el("axis-x").innerHTML = math(xlabel)
  el("axis-y").innerHTML = math(ylabel)
  const currentMode = el("plot").layout?.dragmode || "zoom"
  const layout = {
    autosize: true,
    height: innerWidth < 500 ? 390 : 430,
    paper_bgcolor: token("--panel"),
    plot_bgcolor: token("--panel"),
    font: { family: "system-ui,Microsoft YaHei,sans-serif", size: 14, color: token("--muted") },
    margin: { l: innerWidth < 500 ? 53 : 65, r: 22, t: 48, b: 62 },
    dragmode: currentMode,
    showlegend: false,
    hovermode: "closest",
    uirevision: key,
    xaxis: {
      range: xrange,
      gridcolor: token("--line"),
      zerolinecolor: token("--line"),
      automargin: true,
    },
    yaxis: {
      autorange: true,
      type: logy ? "log" : "linear",
      gridcolor: token("--line"),
      zerolinecolor: token("--line"),
      automargin: true,
    },
  }
  if (same) {
    delete layout.xaxis.range
    delete layout.yaxis.autorange
  }
  await Plotly.react(el("plot"), traces, layout, {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["select2d", "lasso2d", "toImage"],
    doubleClick: "reset+autosize",
  })
}
export function connectTools() {
  document.querySelector(".toolbar").addEventListener("click", (event) => {
    const tool = event.target.closest("[data-tool]")?.dataset.tool
    if (!tool) return
    if (tool === "reset")
      Plotly.relayout(el("plot"), { "xaxis.autorange": true, "yaxis.autorange": true })
    else {
      Plotly.relayout(el("plot"), { dragmode: tool })
      for (const button of document.querySelectorAll("[data-tool]"))
        if (button.dataset.tool !== "reset")
          button.setAttribute("aria-pressed", String(button.dataset.tool === tool))
    }
  })
}
export const trace = (points, name, lineColor, { dash = false, width = 2.6 } = {}) => ({
  type: "scatter",
  mode: "lines",
  x: points.map((p) => p[0]),
  y: points.map((p) => p[1]),
  name,
  line: { color: lineColor, width, dash: dash ? "dash" : "solid" },
  hovertemplate: "%{x:.5g}<br>%{y:.6g}<extra>%{fullData.name}</extra>",
})
