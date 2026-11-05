import fs from "node:fs/promises"
import path from "node:path"
import { FilePath } from "../../util/path"
import { renderMath } from "./fpksMath/engine"

const formulas: Record<string, string> = {
  definition: String.raw`f_\nu(z)=\frac{1}{\Gamma(\nu)}\int_0^\infty\frac{x^{\nu-1}}{z^{-1}e^x+1}\,dx`,
  occupation: String.raw`f(E;\mu,T)=\frac{1}{\exp[(E-\mu)/(k_BT)]+1}`,
  eta: String.raw`\eta=\ln z`,
  z: "z",
  nu: String.raw`\nu`,
  fnu: String.raw`f_\nu(z)`,
  small: String.raw`z\ll1`,
  classic: String.raw`f_\nu(z)\simeq z`,
  large: String.raw`f_\nu(e^\eta)\sim\frac{\eta^\nu}{\Gamma(\nu+1)}\left[1+\frac{\pi^2\nu(\nu-1)}{6\eta^2}\right]`,
  zOne: "z=1",
  etaFour: String.raw`\ln z=4`,
  tau: String.raw`T/T_F`,
  energy: String.raw`E/E_F`,
  mu: String.raw`\mu/E_F`,
  fixedMu: String.raw`\mu=E_F`,
  fE: "f(E)",
  exponent: String.raw`(E-\mu)/(k_BT)`,
  step: String.raw`\theta(E_F-E)`,
  limit: String.raw`\lim_{T\to0^+}f(E;\mu,T)=\theta(\mu-E)`,
}
for (const [nu, tex] of [
  ["0.5", String.raw`\tfrac12`],
  ["1", "1"],
  ["1.5", String.raw`\tfrac32`],
  ["2.5", String.raw`\tfrac52`],
]) {
  formulas[`nu-${nu}`] = String.raw`\nu=${tex}`
  formulas[`f-${nu}`] = `f_{${tex}}(z)`
  formulas[`ratio-${nu}`] = String.raw`\frac{f_{${tex}}(z)}{z}`
}
for (const value of ["0.25", "0.1", "0.03"]) formulas[`t-${value}`] = `T/T_F=${value}`

// Run inside FpksMathAssets before its shared stylesheet/font pass, avoiding
// concurrent access to MathJax and ensuring every glyph used by a widget is emitted.
export async function* emitFermiAssets(output: string): AsyncGenerator<FilePath> {
  const directory = path.join(output, "static/interactive/fermi-dirac")
  await fs.mkdir(directory, { recursive: true })
  const rendered: Record<string, { tex: string; html: string }> = {}
  for (const [key, tex] of Object.entries(formulas)) {
    const html = (await renderMath(tex, false)).replace(/ data-latex="[^"]*"/g, "")
    if (html.includes("<mjx-merror")) throw new Error(`Widget formula failed: ${tex}`)
    rendered[key] = { tex, html }
  }
  const target = path.join(directory, "formulas.json") as FilePath
  await fs.writeFile(target, JSON.stringify(rendered))
  yield target
  for (const [source, dest] of [
    ["plotly-basic.min.js", "plotly.min.js"],
    ["LICENSE", "plotly-LICENSE.txt"],
  ]) {
    const target = path.join(directory, dest) as FilePath
    await fs.copyFile(path.join("node_modules/plotly.js-basic-dist-min", source), target)
    yield target
  }
}
