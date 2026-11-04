// Runs inside headless Chrome. Excalidraw's own exporter is the only renderer that
// matches the plugin's output: same roughness seeds, fonts and element metrics.
import { exportToSvg, restoreElements, restoreAppState } from "@excalidraw/excalidraw"

window.renderScene = async (scene) => {
  const elements = restoreElements(scene.elements, null, { refreshDimensions: false }).filter(
    (element) => !element.isDeleted,
  )
  const svg = await exportToSvg({
    elements,
    appState: {
      ...restoreAppState(scene.appState, null),
      exportBackground: true,
      exportWithDarkMode: false,
      exportEmbedScene: false,
      viewBackgroundColor: "#fffdf7",
    },
    files: scene.files,
    exportPadding: 24,
  })
  return { svg: svg.outerHTML, count: elements.length }
}
window.rendererReady = true
