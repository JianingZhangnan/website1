import { joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function versionedReaderAsset(resource: string): string {
  const version = process.env.QUARTZ_ASSET_VERSION?.trim()
  return version ? `${resource}?v=${encodeURIComponent(version)}` : resource
}

const ReadonlyExcalidraw: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const scene = fileData.frontmatter?.excalidrawScene
  if (typeof scene !== "string" || scene.length === 0 || !fileData.slug) {
    return null
  }

  const root = pathToRoot(fileData.slug)
  const sceneUrl = versionedReaderAsset(joinSegments(root, scene))
  const readerRoot = joinSegments(root, "static", "excalidraw-reader")

  return (
    <section class="readonly-excalidraw-section" aria-label="只读 Excalidraw 绘图">
      <link rel="stylesheet" href={versionedReaderAsset(joinSegments(readerRoot, "reader.css"))} />
      <div
        class="readonly-excalidraw-mount"
        data-excalidraw-scene={sceneUrl}
        data-excalidraw-title={fileData.frontmatter?.title ?? "Excalidraw 绘图"}
        data-excalidraw-immersive="true"
      >
        <p class="readonly-excalidraw-loading">正在载入只读绘图…</p>
      </div>
      <script
        type="module"
        src={versionedReaderAsset(joinSegments(readerRoot, "reader.js"))}
      ></script>
    </section>
  )
}

ReadonlyExcalidraw.css = `
.readonly-excalidraw-section {
  width: 100%;
  margin: 1rem 0 1.75rem;
}

.readonly-excalidraw-loading {
  padding: 2rem;
  border: 1px solid var(--lightgray);
  border-radius: 0.75rem;
  color: var(--darkgray);
  text-align: center;
}
`

export default (() => ReadonlyExcalidraw) satisfies QuartzComponentConstructor
