const sidebarWidthKey = "fpks-sidebar-width"

document.addEventListener("nav", () => {
  const handle = document.querySelector<HTMLElement>(".fpks-sidebar-resize")
  const sidebar = handle?.closest<HTMLElement>(".sidebar.left")
  if (!handle || !sidebar) return
  const root = document.documentElement
  const desktop = matchMedia("(min-width: 801px)")
  const limits = () => ({
    min: 240,
    max: Math.max(240, Math.min(640, window.innerWidth - (window.innerWidth > 1200 ? 800 : 480))),
  })
  const updateAria = () => {
    const { min, max } = limits()
    handle.setAttribute("aria-valuemin", String(min))
    handle.setAttribute("aria-valuemax", String(max))
    handle.setAttribute("aria-valuenow", String(Math.round(sidebar.getBoundingClientRect().width)))
  }
  const setWidth = (requested: number) => {
    const { min, max } = limits()
    const width = Math.round(Math.min(max, Math.max(min, requested)))
    root.style.setProperty("--fpks-sidebar-width", `${width}px`)
    updateAria()
    return width
  }
  const saveWidth = () => {
    try {
      localStorage.setItem(
        sidebarWidthKey,
        String(Math.round(sidebar.getBoundingClientRect().width)),
      )
    } catch {}
  }

  let activePointer: number | undefined
  let startX = 0
  let startWidth = 0
  const finish = () => {
    if (activePointer === undefined) return
    activePointer = undefined
    root.classList.remove("fpks-sidebar-resizing")
    saveWidth()
  }
  const down = (event: PointerEvent) => {
    if (!desktop.matches || event.button !== 0 || !event.isPrimary) return
    event.preventDefault()
    activePointer = event.pointerId
    startX = event.clientX
    startWidth = sidebar.getBoundingClientRect().width
    handle.setPointerCapture(event.pointerId)
    handle.focus({ preventScroll: true })
    root.classList.add("fpks-sidebar-resizing")
  }
  const move = (event: PointerEvent) => {
    if (event.pointerId === activePointer) setWidth(startWidth + event.clientX - startX)
  }
  const up = (event: PointerEvent) => {
    if (event.pointerId !== activePointer) return
    finish()
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId)
  }
  const reset = () => {
    setWidth(320)
    saveWidth()
  }
  const keydown = (event: KeyboardEvent) => {
    if (!desktop.matches) return
    const width = sidebar.getBoundingClientRect().width
    const change: Record<string, number> = {
      ArrowLeft: width - 16,
      ArrowRight: width + 16,
      Home: limits().min,
      End: limits().max,
    }
    if (!(event.key in change)) return
    event.preventDefault()
    setWidth(change[event.key])
    saveWidth()
  }
  const resize = () => {
    if (!desktop.matches) finish()
    updateAria()
  }
  handle.addEventListener("pointerdown", down)
  handle.addEventListener("pointermove", move)
  handle.addEventListener("pointerup", up)
  handle.addEventListener("pointercancel", up)
  handle.addEventListener("lostpointercapture", finish)
  handle.addEventListener("dblclick", reset)
  handle.addEventListener("keydown", keydown)
  window.addEventListener("resize", resize)
  updateAria()
  window.addCleanup(() => {
    finish()
    handle.removeEventListener("pointerdown", down)
    handle.removeEventListener("pointermove", move)
    handle.removeEventListener("pointerup", up)
    handle.removeEventListener("pointercancel", up)
    handle.removeEventListener("lostpointercapture", finish)
    handle.removeEventListener("dblclick", reset)
    handle.removeEventListener("keydown", keydown)
    window.removeEventListener("resize", resize)
  })
})
