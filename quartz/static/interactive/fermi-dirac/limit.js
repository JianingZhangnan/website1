import { math, range, el, number, updateOutputs } from "./math.js?v=wheel-20261105"
import { sigmoid, chemicalPotential, samples, fmt } from "./numerics.js?v=wheel-20261105"
import {
  chartShell,
  connectTools,
  color,
  colorVariable,
  plot,
  trace,
} from "./chart.js?v=wheel-20261105"
export function mountLimit(app) {
  app.innerHTML = `<h1>低温极限：曲线怎样变成阶跃</h1><p class="intro">横轴是单粒子能量。降温时比较能量与化学势的位置；固定密度时化学势也随温度变化。</p><div class="formula-box">${math("occupation")}</div><div class="controls">${range("tau", math("tau"), 0, 0.6, 0.002, 0.08)}<label for="ensemble">保持什么不变<select id="ensemble"><option value="fixed-mu">固定化学势为费米能</option><option value="fixed-n">固定密度，数值求解 μ(T)</option></select></label>${range("probe", "取样能量 " + math("energy"), 0, 2, 0.005, 0.85)}</div><fieldset><legend>叠加比较</legend><div class="choice-grid">${[0.25, 0.1, 0.03].map((t, i) => `<label class="check"><input type="checkbox" data-temp="${t}" checked><span style="color:${colorVariable(i === 2 ? 3 : i)}">${math("t-" + t)}</span></label>`).join("")}<label class="check"><input id="step" type="checkbox" checked>零温阶跃 ${math("step")}</label></div></fieldset><div class="presets"><button data-preset-temp=".25">0.25</button><button data-preset-temp=".08">0.08</button><button data-preset-temp=".01">0.01</button><button data-preset-temp="0">零温极限</button></div>${chartShell()}<div id="readout" class="readout" role="status" aria-live="polite"></div><p id="explanation" class="hint"></p><div class="formula-box">${math("limit")}</div>`
  connectTools()
  const occupation = (e, t, mu) =>
    t === 0 ? (e < mu ? 1 : e > mu ? 0 : 0.5) : sigmoid((mu - e) / t)
  const update = async () => {
    updateOutputs()
    const tau = number("tau"),
      e = number("probe"),
      fixedN = el("ensemble").value === "fixed-n"
    const mu = fixedN ? chemicalPotential(tau) : 1,
      traces = []
    for (const input of document.querySelectorAll("[data-temp]:checked")) {
      const t = Number(input.dataset.temp),
        m = fixedN ? chemicalPotential(t) : 1,
        index = [0.25, 0.1, 0.03].indexOf(t)
      traces.push(
        trace(
          samples(0, 2, 700, (e) => occupation(e, t, m)),
          `温度比 = ${t}`,
          color(index === 2 ? 3 : index),
        ),
      )
    }
    if (el("step").checked)
      traces.push(
        trace(
          [
            [0, 1],
            [1, 1],
            [1, 0],
            [2, 0],
          ],
          "零温阶跃",
          getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(),
          { dash: true },
        ),
      )
    traces.push(
      trace(
        tau === 0
          ? [
              [0, 1],
              [mu, 1],
              [mu, 0],
              [2, 0],
            ]
          : samples(0, 2, 900, (e) => occupation(e, tau, mu)),
        `当前温度 ${tau}`,
        color(2),
        { width: 3.5 },
      ),
    )
    traces.push({
      type: "scatter",
      mode: "markers",
      x: [e],
      y: [occupation(e, tau, mu)],
      marker: { size: 9, color: color(2) },
      name: "当前取样点",
      hovertemplate: "%{x:.4g}<br>%{y:.6g}<extra></extra>",
    })
    await plot(traces, { key: "limit-" + fixedN, xrange: [0, 2], xlabel: "energy", ylabel: "fE" })
    el("readout").innerHTML =
      `<div class="metrics"><span class="metric">${math("mu")} = <b>${fmt(mu)}</b></span><span class="metric">${math("fE")} = <b>${fmt(occupation(e, tau, mu))}</b></span>${tau ? `<span class="metric">${math("exponent")} = <b>${fmt((e - mu) / tau)}</b></span>` : ""}</div>`
    el("explanation").textContent =
      tau === 0
        ? "零温时，阈值左边填满、右边为空，边界点按 1/2 约定作图。竖线表示函数的跳跃。"
        : fixedN
          ? "每次从粒子数积分数值求解化学势，保持密度固定。温度下降时，化学势趋于费米能。"
          : "固定化学势：能量低于化学势时，指数随降温趋于负无穷，占据数趋于 1；能量高于化学势时相反，占据数趋于 0。"
  }
  app.addEventListener("input", update)
  app.addEventListener("change", update)
  app.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset-temp]")
    if (button) {
      el("tau").value = button.dataset.presetTemp
      update()
    }
  })
  return update
}
