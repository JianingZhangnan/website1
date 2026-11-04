// @ts-nocheck
// Build-time MathJax 4.1.3 renderer configured like the vault's Obsidian plugins:
// `mathjax4-pagella` (fonts, scale, typography defaults) and `auto-displaystyle-v2`
// (display style for inline math and for fraction parts).
import path from "path"
import { pathToFileURL } from "url"
import hybridFontData from "./hybrid-font-data.json"
import {
  createHybridExtension,
  createLadrModernExtension,
  createLadrTermesExtension,
  createStixPipeExtension,
  createVectorAccentExtension,
  spaceScriptCommas,
} from "./fontExtensions"

export const MATH_ASSET_ROOT = "/static/fpks-math"
export const MATH_STYLESHEET = `${MATH_ASSET_ROOT}/mathjax.css`

// npm package that holds the WOFF2 files of each folder under MATH_ASSET_ROOT.
export const MATH_FONT_PACKAGES = {
  pagella: "@mathjax/mathjax-pagella-font",
  newcm: "@mathjax/mathjax-newcm-font",
  asana: "@mathjax/mathjax-asana-font",
  modern: "@mathjax/mathjax-modern-font",
  stix2: "@mathjax/mathjax-stix2-font",
  termes: "@mathjax/mathjax-termes-font",
}

const fontUrl = (folder) => `${MATH_ASSET_ROOT}/${folder}`

const EXTRA_PACKAGES = ["boldsymbol", "braket", "color", "mathtools", "physics"]
const CASES_ROW_SPACING = ".4em"

// ---- auto-displaystyle-v2 (main.js, unchanged logic) ------------------------------

const DISPLAYSTYLE = "\\displaystyle "
const HAS_DISPLAYSTYLE = /^\s*\\displaystyle\b/
const FULL_SIZE_FRACTION_MACROS =
  "\\def\\AutoDisplaystyleFrac#1#2" +
  "{\\frac{\\displaystyle #1}{\\displaystyle #2}}" +
  "\\def\\AutoDisplaystyleDfrac#1#2" +
  "{\\dfrac{\\displaystyle #1}{\\displaystyle #2}}" +
  "\\def\\AutoDisplaystyleTfrac#1#2" +
  "{\\tfrac{\\displaystyle #1}{\\displaystyle #2}}"
const FRACTION_COMMAND = /\\(dfrac|tfrac|frac)\b/g

function withDisplaystyle(source) {
  return HAS_DISPLAYSTYLE.test(source) ? source : DISPLAYSTYLE + source
}

function isEscapedAt(source, index) {
  let precedingSlashes = 0
  for (let cursor = index - 1; cursor >= 0 && source[cursor] === "\\"; cursor--) {
    precedingSlashes++
  }
  return precedingSlashes % 2 === 1
}

function withFullSizeFractions(source) {
  let replaced = false
  const rewritten = source.replace(FRACTION_COMMAND, (command, name, offset) => {
    if (isEscapedAt(source, offset)) return command
    replaced = true
    if (name === "dfrac") return "\\AutoDisplaystyleDfrac"
    if (name === "tfrac") return "\\AutoDisplaystyleTfrac"
    return "\\AutoDisplaystyleFrac"
  })
  return replaced ? FULL_SIZE_FRACTION_MACROS + rewritten : rewritten
}

export function prepareMathSource(source, display) {
  return withFullSizeFractions(display ? source : withDisplaystyle(source))
}

// ---- mathjax4-pagella (main.js, same options and install order) -------------------

function installFontExtensions(MathJax) {
  const outputJax = MathJax.startup.document.outputJax
  const font = outputJax.font
  const fontClass = font.constructor

  // STIX pipe and dagger.
  const stix = createStixPipeExtension(fontUrl("stix2"))
  fontClass.addExtension(stix)
  outputJax.addExtension(stix)

  // LADR glyph mixing. Fresh data per target: MathJax mutates it on install.
  fontClass.addExtension(createLadrTermesExtension(fontUrl("termes")))
  outputJax.addExtension(createLadrTermesExtension(fontUrl("termes")))
  fontClass.addExtension(
    createLadrModernExtension(
      fontUrl("modern"),
      fontClass.defaultSizeVariants,
      fontClass.defaultStretchVariants,
    ),
  )
  outputJax.addExtension(
    createLadrModernExtension(fontUrl("modern"), font.sizeVariants, font.stretchVariants),
  )
  fontClass.addExtension(createVectorAccentExtension(fontUrl("pagella")))
  outputJax.addExtension(createVectorAccentExtension(fontUrl("pagella")))

  // NewCM and Asana take precedence over the mappings above.
  for (const key of ["newcm", "asana"]) {
    const source = hybridFontData[key]
    fontClass.addExtension(
      createHybridExtension(
        key,
        source,
        fontUrl(key),
        fontClass.defaultSizeVariants,
        fontClass.defaultStretchVariants,
      ),
    )
    outputJax.addExtension(
      createHybridExtension(key, source, fontUrl(key), font.sizeVariants, font.stretchVariants),
    )
  }

  // Vector accents keep Asana's stretch tables; relation arrows sharing the same
  // code points use NewCM.
  const asana = hybridFontData.asana
  const accentDelimiters = createHybridExtension(
    "asana",
    { ...asana, delimiters: asana.accentDelimiters },
    "",
    font.sizeVariants,
    font.stretchVariants,
  ).delimiters
  font.__fpksVectorFont = Object.assign(Object.create(font), {
    delimiters: { ...font.delimiters, ...accentDelimiters },
  })
  const factory = outputJax.factory
  const Mo = factory.getNodeClass("mo")
  factory.setNodeClass(
    "mo",
    class extends Mo {
      constructor(...args) {
        super(...args)
        if (this.node.isAccent && this.font.__fpksVectorFont) {
          this.font = this.font.__fpksVectorFont
        }
      }
    },
  )
  outputJax.chtmlStyles = null
}

function installTypographyDefaults(MathJax) {
  const inputJax = MathJax.startup.document.inputJax.find((input) => input.name === "TeX")
  const cases = inputJax.parseOptions.handlers.get("environment").lookup("cases")
  if (!cases || cases.args.length !== 7) {
    throw new Error("MathJax cases environment signature is unexpected")
  }
  cases.args[5] = CASES_ROW_SPACING
  cases.args[6] = "D"
  inputJax.postFilters.add(spaceScriptCommas, 10)
}

let enginePromise = null

// One instance per worker thread; Quartz parses notes in a worker pool.
export function getMathEngine() {
  enginePromise ??= (async () => {
    const { default: MathJaxModule } = await import("@mathjax/src")
    const MathJax = await MathJaxModule.init({
      loader: {
        paths: { "mathjax-pagella": "@mathjax/mathjax-pagella-font" },
        load: ["input/tex", "output/chtml", ...EXTRA_PACKAGES.map((name) => `[tex]/${name}`)],
        // Node rejects bare `D:/...` paths in import(), which the publisher hits on Windows.
        require: (file) => import(path.isAbsolute(file) ? pathToFileURL(file).href : file),
      },
      tex: { packages: { "[+]": EXTRA_PACKAGES } },
      output: {
        font: "mathjax-pagella",
        fontURL: fontUrl("pagella"),
        scale: 1.15,
        displayOverflow: "overflow",
        adaptiveCSS: false,
      },
      startup: { typeset: false },
      options: { renderActions: { assistiveMml: [], explorable: [] } },
    })
    await MathJax.startup.document.outputJax.font.loadDynamicFiles()
    installFontExtensions(MathJax)
    installTypographyDefaults(MathJax)
    return MathJax
  })()
  return enginePromise
}

export async function renderMath(source, display) {
  const MathJax = await getMathEngine()
  const node = await MathJax.tex2chtmlPromise(prepareMathSource(source, display), { display })
  return MathJax.startup.adaptor.outerHTML(node)
}

export async function renderStylesheet() {
  const MathJax = await getMathEngine()
  const adaptor = MathJax.startup.adaptor
  return adaptor.cssText(MathJax.chtmlStylesheet())
}
