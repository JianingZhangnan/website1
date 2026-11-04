import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug } from "../util/path"
import { classNames } from "../util/lang"

interface Topic {
  folder: string
  title: string
  description: string
}

const topics: Topic[] = [
  { folder: "量子力学", title: "量子力学", description: "Hilbert 空间、微扰与场的量子化" },
  { folder: "统计物理", title: "统计物理", description: "系综、量子气体与多体 Hilbert 空间" },
  { folder: "数理方法", title: "数理方法", description: "复变函数、特殊函数与本征值问题" },
  { folder: "DSP", title: "数字信号处理", description: "LTI 系统、δ 函数与吉布斯现象" },
  { folder: "Group", title: "群论", description: "从基本定义到同态、商群与稳定子码" },
  { folder: "AISE", title: "AISE", description: "OverlayFS、Docker 等工程实践" },
  { folder: "Excalidraw", title: "手绘画板", description: "讲义与推导的手绘原稿" },
]

const TopicGrid: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
  const entries = topics
    .map((topic) => ({
      ...topic,
      count: allFiles.filter((file) => file.slug?.startsWith(`${topic.folder}/`)).length,
    }))
    .filter((topic) => topic.count > 0)

  return (
    <nav class={classNames(displayClass, "topic-grid")} aria-label="主题入口">
      <h2>从这里开始</h2>
      <ul>
        {entries.map((topic) => (
          <li>
            <a href={resolveRelative(fileData.slug!, `${topic.folder}/` as SimpleSlug)}>
              <span class="topic-title">{topic.title}</span>
              <span class="topic-count">{topic.count} 篇</span>
              <span class="topic-description">{topic.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default (() => TopicGrid) satisfies QuartzComponentConstructor
