import assert from "node:assert/strict"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import {
  computePdfPlusCropGeometry,
  parsePdfPlusFragment,
  pdfPlusCropFilename,
  renderPdfPlusCrop,
} from "./pdf-plus-crops.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const settings = { renderScale: 7, format: "webp", lossless: true, themeAdapt: true }

test("parses PDF++ page, rect, and optional width", () => {
  assert.deepEqual(parsePdfPlusFragment("#page=3&rect=43,72,305,274"), {
    page: 3,
    rect: [43, 72, 305, 274],
    width: null,
  })
  assert.deepEqual(parsePdfPlusFragment("page=2&rect=41,632,209,758&width=320"), {
    page: 2,
    rect: [41, 632, 209, 758],
    width: 320,
  })
})

test("rejects malformed or empty PDF++ selections", () => {
  for (const fragment of [
    "page=0&rect=1,2,3,4",
    "page=1",
    "page=1&rect=1,2,3",
    "page=1&rect=4,2,3,6",
    "page=1&rect=1,2,3,4&width=0",
  ]) {
    assert.throws(() => parsePdfPlusFragment(fragment))
  }
})

test("maps bottom-left PDF coordinates and rotates output dimensions", () => {
  assert.deepEqual(computePdfPlusCropGeometry([0, 0, 612, 792], [43, 72, 305, 274], 7), {
    source: { left: 301, top: 3626, width: 1834, height: 1414 },
    cropWidth: 1834,
    cropHeight: 1414,
    outputWidth: 1834,
    outputHeight: 1414,
  })
  const rotated = computePdfPlusCropGeometry([10, 20, 622, 812], [53, 92, 315, 294], 7, 90)
  assert.equal(rotated.outputWidth, 1414)
  assert.equal(rotated.outputHeight, 1834)
  assert.throws(() => computePdfPlusCropGeometry([0, 0, 612, 792], [-1, 72, 305, 274], 7))
})

test("creates deterministic content-addressed filenames", () => {
  const selection = parsePdfPlusFragment("page=3&rect=43,72,305,274")
  const first = pdfPlusCropFilename("GTCRN_paper.pdf", Buffer.from("pdf"), selection, settings)
  const second = pdfPlusCropFilename("GTCRN_paper.pdf", Buffer.from("pdf"), selection, settings)
  const changed = pdfPlusCropFilename(
    "GTCRN_paper.pdf",
    Buffer.from("changed"),
    selection,
    settings,
  )
  assert.match(first, /^gtcrn-paper-p3-[a-f\d]{16}\.webp$/)
  assert.equal(first, second)
  assert.notEqual(first, changed)
})

test("renders the two approved PDF++ crops at the configured resolution", async () => {
  const cases = [
    {
      file: "GTCRN_paper.pdf",
      fragment: "page=3&rect=43,72,305,274",
      size: [1834, 1414],
    },
    {
      file: "LiSenNet_paper.pdf",
      fragment: "page=2&rect=41,632,209,758",
      size: [1176, 882],
    },
  ]

  for (const fixture of cases) {
    const pdfPath = path.join(
      repoRoot,
      "sites",
      "acoustic",
      "content",
      "assets",
      "files",
      "papers",
      fixture.file,
    )
    const result = await renderPdfPlusCrop(
      pdfPath,
      parsePdfPlusFragment(fixture.fragment),
      settings,
    )
    const metadata = await sharp(result.buffer).metadata()
    assert.equal(metadata.format, "webp")
    assert.deepEqual([metadata.width, metadata.height], fixture.size)
    assert.deepEqual([result.width, result.height], fixture.size)
  }
})
