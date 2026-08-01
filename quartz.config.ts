import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "FPKS 知识花园",
    pageTitleSuffix: " · FPKS",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "jianing-fpks.pages.dev",
    ignorePatterns: ["private", "templates", ".obsidian", "DRAFT", "Clippings"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Serif SC",
        body: "Noto Sans SC",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fbfaf6",
          lightgray: "#e8e4da",
          gray: "#aaa59a",
          darkgray: "#4b4a45",
          dark: "#242522",
          secondary: "#376f63",
          tertiary: "#9a684c",
          highlight: "rgba(55, 111, 99, 0.12)",
          textHighlight: "#f3d77866",
        },
        darkMode: {
          light: "#171a18",
          lightgray: "#303633",
          gray: "#737b76",
          darkgray: "#d3d8d4",
          dark: "#f1f2ef",
          secondary: "#8bc1b3",
          tertiary: "#d5a181",
          highlight: "rgba(139, 193, 179, 0.14)",
          textHighlight: "#8d752e88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
