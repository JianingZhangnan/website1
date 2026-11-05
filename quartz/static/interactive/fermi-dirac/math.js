let formulas
export async function loadMath() {
  const response = await fetch("/static/interactive/fermi-dirac/formulas.json")
  if (!response.ok) throw new Error("公式资源加载失败")
  formulas = await response.json()
}
export function math(key) {
  const item = formulas[key]
  if (!item) throw new Error("未知公式：" + key)
  const label = item.tex.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")
  return `<span class="math-inline" role="math" aria-label="${label}">${item.html}</span>`
}
export const range = (id, label, min, max, step, value) =>
  `<label for="${id}">${label}<output id="${id}-value"></output><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`
export const number = (id) => Number(document.getElementById(id).value)
export const el = (id) => document.getElementById(id)
export function updateOutputs() {
  for (const input of document.querySelectorAll('input[type="range"]'))
    el(input.id + "-value").textContent = Number(input.value).toString()
}
