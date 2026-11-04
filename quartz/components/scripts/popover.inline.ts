import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

// What a link with a fragment points at: a heading's section or one block, as in
// Obsidian's page preview. Null when the page has no such target.
function extractLinkedBlock(html: Document, hash: string): HTMLElement | null {
  const target = html.getElementById(hash.slice(1).replace(/^\^/, ""))
  if (!target?.closest("article")) return null

  const block = html.createElement("article")
  block.classList.add("popover-hint", "popover-block")
  const level = target.tagName.match(/^H([1-6])$/)?.[1]
  if (level) {
    const section: Element[] = [target]
    for (let el = target.nextElementSibling; el; el = el.nextElementSibling) {
      const next = el.tagName.match(/^H([1-6])$/)?.[1]
      if (next && next <= level) break
      section.push(el)
    }
    block.append(...section)
  } else if (target.tagName === "LI") {
    const list = html.createElement(target.parentElement?.tagName ?? "UL")
    list.append(target)
    block.append(list)
  } else {
    block.append(target)
  }
  return block
}

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)
  if (link.dataset.noPopover === "true") {
    return
  }

  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement) {
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    const inner = popoverElement.querySelector<HTMLElement>(".popover-inner")
    if (hash !== "" && inner && !inner.querySelector(".popover-block")) {
      // Fallback when the block was not found: the whole page, scrolled to the fragment.
      const id = `popover-internal-${hash.slice(1).replace(/^\^/, "")}`
      const heading = inner.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
      if (heading) {
        // leave ~12px of buffer when scrolling to a heading
        inner.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  // Per fragment: two links to one note can show different blocks.
  const popoverId = `popover-${link.pathname}${hash}`
  const prevPopoverElement = document.getElementById(popoverId)

  // dont refetch if there's already a popover
  if (!!document.getElementById(popoverId)) {
    showPopover(prevPopoverElement as HTMLElement)
    return
  }

  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
  })

  if (!response) return
  const [contentType] = response.headers.get("Content-Type")!.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentType ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname

      popoverInner.appendChild(img)
      break
    case "application":
      switch (typeInfo) {
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = targetUrl.toString()
          popoverInner.appendChild(pdf)
          break
        default:
          break
      }
      break
    default:
      const contents = await response.text()
      const html = p.parseFromString(contents, "text/html")
      normalizeRelativeURLs(html, targetUrl)
      const block = hash === "" ? null : extractLinkedBlock(html, hash)
      // prepend all IDs inside popovers to prevent duplicates
      ;(block ?? html).querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = block ? [block] : [...html.getElementsByClassName("popover-hint")]
      if (elts.length === 0) return

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  if (!!document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }

  showPopover(popoverElement)
}

function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

document.addEventListener("nav", () => {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseleave", clearActivePopover)
    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
      link.removeEventListener("mouseleave", clearActivePopover)
    })
  }
})
