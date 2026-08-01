# FPKS 知识花园

这是 Jianing 的个人网站知识库，使用 [Quartz 4](https://quartz.jzhao.xyz/) 将 Obsidian Markdown 笔记构建为静态网站，并通过 Cloudflare Pages 发布。

## 内容与发布

- 网站内容位于 `content/`。
- 本地完整资料库位于台式机 `D:\learn\FPKS`，其中的草稿、私人配置、PDF、字体和临时文件不会公开。
- `scripts/publish.ps1` 将公开内容同步到本仓库、构建网站、提交并推送。
- 推送到 `main` 后，由 Cloudflare Pages 自动构建和发布。

本地预览：

```powershell
npm ci
npx quartz build --serve
```

同步并发布：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish.ps1
```

Cloudflare Pages 构建配置：

- Build command: `npx quartz build`
- Build output directory: `public`
- Node.js: `22` 或更高

## 许可

本仓库原创知识库内容使用 MIT License，详见 `LICENSE`。Quartz 自身的许可见 `LICENSE.txt`。引用的图片或第三方材料仍归原权利人所有。
