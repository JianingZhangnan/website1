import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createCanvas } from "@napi-rs/canvas"
import { getDocument, version as pdfjsVersion } from "pdfjs-dist/legacy/build/pdf.mjs"
import sharp from "sharp"

const STANDARD_FONT_DATA_URL = `${fileURLToPath(
  new URL("../../standard_fonts/", import.meta.resolve("pdfjs-dist/legacy/build/pdf.mjs")),
).replaceAll("\\", "/")}/`

const RIGHT_ANGLE_ROTATIONS = new Set([0, 90, 180, 270])

function parseFiniteNumber(value, label) {
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error(`${label} must be a finite number`)
  return number
}

export function parsePdfPlusFragment(fragment) {
  const source = String(fragment ?? "").replace(/^#/, "")
  const params = new URLSearchParams(source)
  const pageValues = params.getAll("page")
  const rectValues = params.getAll("rect")
  const widthValues = params.getAll("width")

  if (pageValues.length !== 1 || rectValues.length !== 1) {
    throw new Error("PDF++ embeds require exactly one page and one rect parameter")
  }
  if (widthValues.length > 1) throw new Error("PDF++ embeds accept at most one width parameter")

  const page = Number(pageValues[0])
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("PDF++ page must be a positive 1-based integer")
  }

  const rectParts = rectValues[0].split(",")
  if (rectParts.length !== 4) throw new Error("PDF++ rect must contain x1,y1,x2,y2")
  const rect = rectParts.map((value, index) =>
    parseFiniteNumber(value, `PDF++ rect coordinate ${index + 1}`),
  )
  const [x1, y1, x2, y2] = rect
  if (x2 <= x1 || y2 <= y1) {
    throw new Error("PDF++ rect must have x2 > x1 and y2 > y1")
  }

  let width = null
  if (widthValues.length === 1) {
    width = parseFiniteNumber(widthValues[0], "PDF++ width")
    if (width <= 0) throw new Error("PDF++ width must be positive")
  }

  return { page, rect, width }
}

export function computePdfPlusCropGeometry(view, rect, scale, rotation = 0) {
  if (!Array.isArray(view) || view.length !== 4) throw new Error("PDF page view is invalid")
  if (!Array.isArray(rect) || rect.length !== 4) throw new Error("PDF++ rect is invalid")
  if (!Number.isFinite(scale) || scale <= 0) throw new Error("PDF++ render scale must be positive")
  if (!RIGHT_ANGLE_ROTATIONS.has(rotation)) {
    throw new Error(`Unsupported PDF page rotation: ${rotation}`)
  }

  const [pageX1, pageY1, pageX2, pageY2] = view
  const [x1, y1, x2, y2] = rect
  const values = [...view, ...rect]
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("PDF page and crop coordinates must be finite")
  }
  if (pageX2 <= pageX1 || pageY2 <= pageY1) throw new Error("PDF page view is empty")
  if (x1 < pageX1 || y1 < pageY1 || x2 > pageX2 || y2 > pageY2) {
    throw new Error(`PDF++ rect ${rect.join(",")} is outside page bounds ${view.join(",")}`)
  }
  if (x2 <= x1 || y2 <= y1) throw new Error("PDF++ rect is empty")

  const source = {
    left: (x1 - pageX1) * scale,
    top: (pageY2 - y2) * scale,
    width: (x2 - x1) * scale,
    height: (y2 - y1) * scale,
  }
  const cropWidth = Math.floor(source.width)
  const cropHeight = Math.floor(source.height)
  if (cropWidth < 1 || cropHeight < 1) throw new Error("PDF++ crop is smaller than one pixel")

  return {
    source,
    cropWidth,
    cropHeight,
    outputWidth: rotation % 180 === 0 ? cropWidth : cropHeight,
    outputHeight: rotation % 180 === 0 ? cropHeight : cropWidth,
  }
}

export function pdfPlusCropFilename(pdfPath, pdfBytes, selection, settings) {
  const stem = path
    .basename(pdfPath, path.extname(pdfPath))
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLocaleLowerCase("en-US")
  const renderContract = JSON.stringify({
    renderer: `pdfjs-dist@${pdfjsVersion}`,
    page: selection.page,
    rect: selection.rect,
    renderScale: settings.renderScale,
    format: settings.format,
    lossless: settings.lossless,
  })
  const digest = createHash("sha256")
    .update(pdfBytes)
    .update("\0")
    .update(renderContract)
    .digest("hex")
    .slice(0, 16)
  return `${stem || "pdf"}-p${selection.page}-${digest}.${settings.format}`
}

function rotateCanvas(canvas, rotation) {
  const normalized = ((rotation % 360) + 360) % 360
  if (!RIGHT_ANGLE_ROTATIONS.has(normalized)) {
    throw new Error(`Unsupported PDF page rotation: ${rotation}`)
  }
  if (normalized === 0) return canvas

  const rotated = createCanvas(
    normalized % 180 === 0 ? canvas.width : canvas.height,
    normalized % 180 === 0 ? canvas.height : canvas.width,
  )
  const context = rotated.getContext("2d")
  context.translate(rotated.width / 2, rotated.height / 2)
  context.rotate((normalized * Math.PI) / 180)
  context.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
  return rotated
}

export async function renderPdfPlusCrop(pdfPath, selection, settings) {
  if (settings.format !== "webp") throw new Error("Only WebP PDF++ crops are supported")
  if (typeof settings.lossless !== "boolean") {
    throw new Error("PDF++ lossless must be a boolean")
  }

  const pdfBytes = await readFile(pdfPath)
  const loadingTask = getDocument({
    data: new Uint8Array(pdfBytes),
    disableWorker: true,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    useWorkerFetch: false,
  })

  try {
    const document = await loadingTask.promise
    if (selection.page > document.numPages) {
      throw new Error(`PDF++ page ${selection.page} exceeds the ${document.numPages}-page document`)
    }

    const page = await document.getPage(selection.page)
    const rotation = ((page.rotate % 360) + 360) % 360
    const geometry = computePdfPlusCropGeometry(
      [...page.view],
      selection.rect,
      settings.renderScale,
      rotation,
    )
    const viewport = page.getViewport({ scale: settings.renderScale, rotation: 0 })
    const rendered = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height))
    const renderedContext = rendered.getContext("2d")
    renderedContext.fillStyle = "#ffffff"
    renderedContext.fillRect(0, 0, rendered.width, rendered.height)
    await page.render({
      canvas: rendered,
      canvasContext: renderedContext,
      viewport,
      background: "#ffffff",
    }).promise

    const crop = createCanvas(geometry.cropWidth, geometry.cropHeight)
    crop
      .getContext("2d")
      .drawImage(
        rendered,
        geometry.source.left,
        geometry.source.top,
        geometry.source.width,
        geometry.source.height,
        0,
        0,
        geometry.cropWidth,
        geometry.cropHeight,
      )
    const rotated = rotateCanvas(crop, rotation)
    const buffer = await sharp(rotated.toBuffer("image/png"))
      .webp({ lossless: settings.lossless })
      .toBuffer()
    page.cleanup()

    return {
      buffer,
      width: geometry.outputWidth,
      height: geometry.outputHeight,
      filename: pdfPlusCropFilename(pdfPath, pdfBytes, selection, settings),
      mimeType: "image/webp",
    }
  } finally {
    await loadingTask.destroy()
  }
}
