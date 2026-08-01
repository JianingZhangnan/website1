# FPKS 知识花园

这是 Jianing 的个人网站知识库，使用 [Quartz 4](https://quartz.jzhao.xyz/) 将 Obsidian Markdown 笔记构建为静态网站，并通过 Cloudflare Pages 发布。

- 正式站点：<https://notes.zjnmcp.me/>
- GitHub：<https://github.com/JianingZhangnan/website1>
- AI/开发交接：[docs/AI_HANDOFF.md](docs/AI_HANDOFF.md)
- 视觉方向：[docs/DESIGN_BRIEF.md](docs/DESIGN_BRIEF.md)

## 在笔记本上开发

```powershell
git clone https://github.com/JianingZhangnan/website1.git D:\cs\site
Set-Location D:\cs\site
npm ci
npm run dev
```

常用检查：

```powershell
npm run check
npm run build
```

前端开发默认从最新 `main` 新建短期分支。推送分支后先检查 Cloudflare 预览，再合并到 `main`；`main` 是生产分支。首次从新电脑推送时，需要通过 Git Credential Manager 登录 GitHub，或者另行配置 SSH key。

## 内容与自动发布

- 网站公开内容快照位于 `content/`。
- 完整资料库位于台式机 `D:\BaiduSyncdisk\FPKS`；`D:\learn\FPKS` 是指向该目录的兼容 Junction。
- 草稿、私人配置、PDF、字体、临时文件和大文件不会进入公开仓库。
- 台式机的 `scripts/publish.ps1` 每 12 小时先快进到远程 `main`，再将允许公开的内容同步到本仓库、检查敏感信息、构建、提交并推送。
- 推送到 `main` 后，Cloudflare Pages 自动构建并发布。

手动同步并发布（仅在台式机）：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish.ps1
```

Cloudflare Pages 构建配置：

- Build command: `npx quartz build`
- Build output directory: `public`
- Node.js: `22` 或更高

## 许可

本仓库原创知识库内容使用 MIT License，详见 `LICENSE`。Quartz 自身的许可见 `LICENSE.txt`。引用的图片或第三方材料仍归原权利人所有。
