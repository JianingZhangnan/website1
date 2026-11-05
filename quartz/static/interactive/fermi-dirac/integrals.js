import { math, range, el, number, updateOutputs } from "./math.js"
import { fd, asymptotic, fmt, samples } from "./numerics.js"
import { chartShell, connectTools, color, colorVariable, plot, trace } from "./chart.js"
const orders = [0.5, 1, 1.5, 2.5],
  cache = new Map()
export function mountIntegrals(app) {
  app.innerHTML = `<h1>费米积分：选择曲线与局部放大</h1><p class="intro">先单独看一个阶数，再切换到叠加比较。缩放只改变查看范围，不改变函数。</p><div class="formula-box">${math("definition")}</div><div class="controls">${range("eta", math("eta"), -8, 12, 0.05, 0)}<label for="view">显示方式<select id="view"><option value="single">只显示一个阶数</option><option value="compare">勾选多个阶数对比</option></select></label><label for="nu">选择阶数 ${math("nu")}<select id="nu"><option value=".5">1/2</option><option value="1">1</option><option value="1.5" selected>3/2 · 粒子数</option><option value="2.5">5/2 · 压强</option></select></label><label for="axis">横轴<select id="axis"><option value="eta">η = ln z</option><option value="z">逸度 z</option></select></label></div><fieldset id="curves" hidden><legend>显示哪些阶数</legend><div class="choice-grid">${orders.map((nu, i) => `<label class="check"><input type="checkbox" data-nu="${nu}" checked><span style="color:${colorVariable(i)}">${math("nu-" + nu)}</span></label>`).join("")}</div></fieldset><div class="choice-grid"><label class="check"><input id="logy" type="checkbox">对数纵轴</label><label class="check"><input id="classic" type="checkbox">${math("classic")} 参照</label><label class="check"><input id="large" type="checkbox">大逸度近似参照</label></div><div class="presets"><button data-eta="-5">经典区 ${math("small")}</button><button data-eta="0">${math("zOne")}</button><button data-eta="4">${math("etaFour")}</button><button data-eta="10">大逸度区</button></div>${chartShell()}<div id="readout" class="readout" role="status" aria-live="polite"></div><p class="hint">拖动框选要查看的区域；切换“拖动平移”可移动视野。对数纵轴适合同时观察大小不同的曲线。</p><details><summary>近似的使用范围</summary><p>小逸度参照只画到 ${math("zOne")}；大逸度参照从 ${math("etaFour")} 开始。</p><div class="formula-box">${math("large")}</div></details>`
  connectTools()
  const update = async () => {
    updateOutputs()
    const eta = number("eta"),
      nu = number("nu"),
      direct = el("axis").value === "z",
      compare = el("view").value === "compare"
    el("curves").hidden = !compare
    const selected = compare
      ? [...document.querySelectorAll("[data-nu]:checked")].map((e) => Number(e.dataset.nu))
      : [nu]
    const observed = selected.includes(nu) ? nu : selected[0]
    const z = Math.exp(eta),
      xmax = direct ? Math.max(10, z * 1.2) : 12,
      xmin = direct ? 0 : -8
    const traces = selected.map((v) => {
      const key = `${v}:${direct}:${xmax}`
      if (!cache.has(key)) {
        const points = direct
          ? [
              [0, 0],
              ...samples(-12, Math.log(xmax), 500, (x) => fd(v, x)).map(([x, y]) => [
                Math.exp(x),
                y,
              ]),
            ]
          : samples(-8, 12, 400, (x) => fd(v, x))
        if (cache.size > 20) cache.clear()
        cache.set(key, points)
      }
      return trace(cache.get(key), `ν = ${v}`, color(orders.indexOf(v)))
    })
    if (selected.length && el("classic").checked)
      traces.push(
        trace(
          samples(direct ? 0 : -8, direct ? 1 : 0, 100, (x) => (direct ? x : Math.exp(x))),
          "小逸度近似",
          getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(),
          { dash: true },
        ),
      )
    if (selected.length && el("large").checked && (!direct || xmax >= Math.exp(4)))
      for (const v of selected)
        traces.push(
          trace(
            samples(direct ? Math.exp(4) : 4, xmax, 150, (x) =>
              asymptotic(v, direct ? Math.log(x) : x),
            ),
            `大逸度近似 ν = ${v}`,
            color(orders.indexOf(v)),
            { dash: true, width: 1.8 },
          ),
        )
    if (observed !== undefined)
      traces.push({
        type: "scatter",
        mode: "markers",
        x: [direct ? z : eta],
        y: [fd(observed, eta)],
        marker: { color: color(orders.indexOf(observed)), size: 9 },
        name: "当前取样点",
        hovertemplate: "%{x:.5g}<br>%{y:.6g}<extra></extra>",
      })
    await plot(traces, {
      key: `${direct}:${direct ? xmax : "eta"}:${selected}:${el("logy").checked}`,
      xrange: [xmin, xmax],
      logy: el("logy").checked,
      xlabel: direct ? "z" : "eta",
      ylabel: "fnu",
    })
    el("readout").innerHTML =
      `<div class="value-line">${math("z")} = <b>${fmt(z)}</b>${observed !== undefined ? `；${math("ratio-" + observed)} = <b>${fmt(fd(observed, eta) / z)}</b>` : ""}</div><div class="metrics">${selected.length ? selected.map((v) => `<span class="metric">${math("f-" + v)} = <b>${fmt(fd(v, eta))}</b></span>`).join("") : "尚未勾选曲线。"}</div>`
  }
  app.addEventListener("input", update)
  app.addEventListener("change", update)
  app.addEventListener("click", (event) => {
    const button = event.target.closest("[data-eta]")
    if (button) {
      el("eta").value = button.dataset.eta
      update()
    }
  })
  return update
}
