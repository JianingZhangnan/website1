/** @jsxImportSource react */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Excalidraw, THEME } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"
import "./excalidraw-reader.css"

type PublishedEmbed = {
  kind: "audio" | "video" | "image" | "note" | "link"
  href: string
  label: string
  text?: string
}

type PublishedMedia = {
  href: string
  label: string
  kind: "audio" | "video"
}

type PublishedScene = {
  elements: readonly Record<string, unknown>[]
  appState?: Record<string, unknown>
  files?: Record<string, Record<string, unknown>>
  fileSources?: Record<string, { href: string; mimeType: string }>
  publishedEmbeds?: Record<string, PublishedEmbed>
  media?: PublishedMedia[]
}

type ReaderApi = {
  scrollToContent: (
    target?: unknown,
    options?: {
      fitToViewport?: boolean
      viewportZoomFactor?: number
      animate?: boolean
      duration?: number
    },
  ) => void
  refresh: () => void
}

const AUDIO_PATTERN = /\.(?:wav|mp3|ogg|m4a|flac)(?:[?#]|$)/i
const VIDEO_PATTERN = /\.(?:mp4|webm|mov)(?:[?#]|$)/i

function currentQuartzTheme() {
  return document.documentElement.getAttribute("saved-theme") === "dark" ? THEME.DARK : THEME.LIGHT
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(String(reader.result)))
    reader.addEventListener("error", () => reject(reader.error))
    reader.readAsDataURL(blob)
  })
}

async function loadScene(sceneUrl: string): Promise<PublishedScene> {
  const response = await fetch(sceneUrl, { credentials: "same-origin" })
  if (!response.ok) throw new Error(`绘图数据请求失败（HTTP ${response.status}）`)

  const scene = (await response.json()) as PublishedScene
  const files = { ...(scene.files ?? {}) }
  const entries = Object.entries(scene.fileSources ?? {})

  await Promise.all(
    entries.map(async ([id, source]) => {
      const assetUrl = new URL(source.href, response.url)
      const assetResponse = await fetch(assetUrl, { credentials: "same-origin" })
      if (!assetResponse.ok) throw new Error(`绘图资源请求失败：${source.href}`)
      const blob = await assetResponse.blob()
      files[id] = {
        id,
        dataURL: await blobToDataUrl(blob),
        mimeType: source.mimeType || blob.type,
        created: 0,
        lastRetrieved: Date.now(),
      }
    }),
  )

  return { ...scene, files }
}

function ReadonlyEmbed({ embed }: { embed: PublishedEmbed }) {
  if (embed.kind === "audio") {
    return <audio className="published-embed-media" controls preload="metadata" src={embed.href} />
  }
  if (embed.kind === "video") {
    return <video className="published-embed-media" controls preload="metadata" src={embed.href} />
  }
  if (embed.kind === "image") {
    return <img className="published-embed-media" src={embed.href} alt={embed.label} />
  }
  if (embed.kind === "note") {
    return (
      <article className="published-note-embed">
        <strong>{embed.label}</strong>
        {embed.text && <pre>{embed.text}</pre>}
        <a href={embed.href} target="_top">
          在页面中打开
        </a>
      </article>
    )
  }
  return (
    <a className="published-link-embed" href={embed.href} target="_top">
      {embed.label}
    </a>
  )
}

function Reader({ host }: { host: HTMLElement }) {
  const sceneUrl = host.dataset.excalidrawScene!
  const title = host.dataset.excalidrawTitle ?? "Excalidraw 绘图"
  const apiRef = useRef<ReaderApi | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [scene, setScene] = useState<PublishedScene | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState(currentQuartzTheme)
  const [themeOverride, setThemeOverride] = useState<"auto" | "light" | "dark">("auto")
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false)
  const fullscreen = nativeFullscreen || pseudoFullscreen

  useEffect(() => {
    let active = true
    loadScene(sceneUrl)
      .then((value) => active && setScene(value))
      .catch(
        (reason: unknown) =>
          active && setError(reason instanceof Error ? reason.message : String(reason)),
      )
    return () => {
      active = false
    }
  }, [sceneUrl])

  useEffect(() => {
    const syncTheme = () => {
      if (themeOverride === "auto") setTheme(currentQuartzTheme())
    }
    document.addEventListener("themechange", syncTheme)
    return () => document.removeEventListener("themechange", syncTheme)
  }, [themeOverride])

  useEffect(() => {
    const syncFullscreen = () =>
      setNativeFullscreen(document.fullscreenElement === wrapperRef.current)
    document.addEventListener("fullscreenchange", syncFullscreen)
    return () => document.removeEventListener("fullscreenchange", syncFullscreen)
  }, [])

  useEffect(() => {
    if (!pseudoFullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [pseudoFullscreen])

  const cycleTheme = useCallback(() => {
    setThemeOverride((current) => {
      const next = current === "auto" ? "light" : current === "light" ? "dark" : "auto"
      setTheme(next === "auto" ? currentQuartzTheme() : next === "dark" ? THEME.DARK : THEME.LIGHT)
      return next
    })
  }, [])

  const fit = useCallback(() => {
    apiRef.current?.scrollToContent(undefined, {
      fitToViewport: true,
      viewportZoomFactor: 0.92,
      animate: true,
      duration: 280,
    })
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!wrapperRef.current) return
    if (document.fullscreenElement === wrapperRef.current) {
      await document.exitFullscreen()
    } else if (pseudoFullscreen) {
      setPseudoFullscreen(false)
    } else {
      try {
        await wrapperRef.current.requestFullscreen()
      } catch {
        setPseudoFullscreen(true)
      }
      if (document.fullscreenElement !== wrapperRef.current) setPseudoFullscreen(true)
    }
    window.setTimeout(() => {
      apiRef.current?.refresh()
      fit()
    }, 100)
  }, [fit, pseudoFullscreen])

  const initialData = useMemo(() => {
    if (!scene) return null
    return {
      elements: scene.elements,
      appState: scene.appState,
      files: scene.files,
      scrollToContent: true,
    }
  }, [scene])

  const renderEmbeddable = useCallback(
    (element: { id: string; link?: string | null }) => {
      const published = scene?.publishedEmbeds?.[element.id]
      if (published) return <ReadonlyEmbed embed={published} />
      if (!element.link) return null
      const kind = AUDIO_PATTERN.test(element.link)
        ? "audio"
        : VIDEO_PATTERN.test(element.link)
          ? "video"
          : "link"
      return <ReadonlyEmbed embed={{ kind, href: element.link, label: "打开关联内容" }} />
    },
    [scene],
  )

  if (error) {
    return (
      <div className="reader-error" role="alert">
        <strong>绘图载入失败</strong>
        <span>{error}</span>
      </div>
    )
  }
  if (!initialData) return <p className="reader-loading">正在载入只读绘图…</p>

  return (
    <div
      className={`excalidraw-reader${pseudoFullscreen ? " reader-pseudo-fullscreen" : ""}`}
      ref={wrapperRef}
    >
      <div className="reader-toolbar" aria-label="绘图阅读工具">
        <div className="reader-heading">
          <strong>{title}</strong>
          <span className="readonly-badge">只读</span>
        </div>
        <div className="reader-actions">
          <button type="button" onClick={fit} title="让全部内容适应窗口">
            适应画布
          </button>
          <button type="button" onClick={cycleTheme} title="自动、浅色、深色循环切换">
            主题：
            {themeOverride === "auto" ? "跟随网页" : themeOverride === "dark" ? "深色" : "浅色"}
          </button>
          <button type="button" onClick={toggleFullscreen}>
            {fullscreen ? "退出全屏" : "全屏"}
          </button>
        </div>
      </div>
      <div className="reader-help">
        拖动画布以平移；滚轮平移，Ctrl/⌘ + 滚轮缩放；绘图中的公开链接和音频可直接打开。
      </div>
      <div className="excalidraw-viewport">
        <Excalidraw
          initialData={initialData as never}
          excalidrawAPI={(api) => {
            apiRef.current = api
          }}
          viewModeEnabled={true}
          zenModeEnabled={true}
          theme={theme}
          langCode="zh-CN"
          autoFocus={false}
          handleKeyboardGlobally={false}
          validateEmbeddable={(link) => /^(?:\.?\.?\/|\/|https?:)/i.test(link)}
          renderEmbeddable={renderEmbeddable as never}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: false,
              saveAsImage: false,
            },
            tools: { image: false },
          }}
        />
      </div>
      {scene?.media && scene.media.length > 0 && (
        <section className="reader-media-list" aria-label="绘图中的媒体">
          <h2>绘图中的音视频</h2>
          {scene.media.map((item) => (
            <div className="reader-media-item" key={item.href}>
              <span>{item.label}</span>
              {item.kind === "audio" ? (
                <audio controls preload="metadata" src={item.href} />
              ) : (
                <video controls preload="metadata" src={item.href} />
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

document.querySelectorAll<HTMLElement>("[data-excalidraw-scene]").forEach((host) => {
  if (host.dataset.excalidrawMounted === "true") return
  host.dataset.excalidrawMounted = "true"
  createRoot(host).render(<Reader host={host} />)
})
