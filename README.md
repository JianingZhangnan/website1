# FPKS 网站仓库

这个仓库只负责网站代码与经过人工审核的公开快照。完整 FPKS 是私人笔记库，不再作为网站工程根目录，也不使用 Git。

| 内容               | 位置                                           | 同步方式                             |
| ------------------ | ---------------------------------------------- | ------------------------------------ |
| 完整私人笔记库     | `D:\BaiduSyncdisk\FPKS`                        | 仅百度网盘，在笔记本与台式机之间同步 |
| 网站工程           | 笔记本 `D:\cs\site`；台式机 `D:\site\website1` | Git                                  |
| 原知识花园公开快照 | `content/`                                     | 人工审阅后提交                       |
| 声学报告公开快照   | `sites/acoustic/content/`                      | 清单批准 + 手动生成 + 人工审阅       |

`Language`（以及历史拼写 `Lauguage`）被发布清单、生成器和 Quartz 配置三重阻断，不会进入任何新生成的声学快照。

## 声学报告的手动发布流程

发布边界由 [`sites/acoustic/publication.json`](sites/acoustic/publication.json) 控制。它批准 `REPORT.md` 当前的一跳双链；只要 REPORT 增删链接，生成器就会拒绝继续，必须先人工检查并修改批准清单。

```powershell
# 1. 只读预览：列出即将发布的页面和二进制资源，不改文件
npm run stage:acoustic

# 2. 审阅列表后，显式刷新网站仓库中的公开快照
npm run stage:acoustic -- --apply

# 3. 验证边界并构建独立站点
npm run check:publication
npm run build:acoustic

# 4. 本地浏览
npm run dev:acoustic

# 5. 人工确认后，显式部署当前公开快照
npm run deploy:acoustic
```

兼容入口 `scripts/publish.ps1` 默认也只做预览；使用 `-Apply` 才会刷新快照并构建。所有这些命令都不会执行 `git add`、提交、推送或部署。

生成规则是：发布 REPORT、REPORT 直接双链到的 Markdown/PDF，以及这些已批准页面和绘图为了正常显示所必需的图片、音频等资源；不会沿普通笔记链接继续递归发布。

## 只读 Excalidraw

三张网络结构图使用官方 Excalidraw React 组件渲染，不是静态 SVG 截图。阅读端提供：

- 拖动/滚轮平移、Ctrl/⌘ + 滚轮缩放和“适应画布”；
- 全屏与跟随网页/浅色/深色主题；
- 已批准的页面链接、页内锚点、图片和音频；
- 绘图内音频控件及画布下方的无障碍备用播放器。

组件始终由受控 `viewModeEnabled` 锁定为只读，并关闭载入、清空、导出、另存、背景编辑等动作。网页不提供编辑或持久化入口。

## 开发与构建

```powershell
npm ci
npm run check
npm run build          # 原知识花园 -> public/
npm run build:acoustic # 声学报告站 -> public-acoustic/
```

现有知识花园仍使用 <https://notes.zjnmcp.me/>；声学报告的独立正式域名是 <https://speechproject.zjnmcp.me/>。声学构建默认用该域名生成 canonical URL、站点地图和 RSS，也可在临时预览时用 `QUARTZ_BASE_URL` 覆盖。`sites/acoustic/content/assets/files/` 下的 PDF、图片和音频统一由 Git LFS 管理；Markdown、场景 JSON 和代码仍用普通 Git。新设备首次同步前需安装 Git LFS 并执行 `git lfs install`。发布资源单文件仍必须小于 24 MiB；以后出现超过此上限或频繁变更的数据集、长音频时，改用 Cloudflare R2，不能放回私人笔记库做网站源目录。

声学站使用独立的 Cloudflare Pages Direct Upload 项目 `speechproject`，生产分支标识为 `publishing/manual-acoustic-site`。Cloudflare 不监视 Git 仓库；只有人工执行 `npm run deploy:acoustic` 才会重新检查边界、构建 `public-acoustic` 并上传。该命令不会刷新快照、暂存、提交或推送 Git，因此私人笔记选取、Git 同步和网站上线仍是彼此分离的明确动作。

更多工程信息见 [`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md)。
