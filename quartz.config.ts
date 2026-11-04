import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { DedupeTitle } from "./quartz/plugins/transformers/dedupeTitle"
import { NavFont } from "./quartz/plugins/transformers/navFont"
import { FpksMath } from "./quartz/plugins/transformers/fpksMath"
import { FpksMathAssets } from "./quartz/plugins/transformers/fpksMath/assets"
import { NoteRelativeLinks } from "./quartz/plugins/transformers/noteRelativeLinks"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "FPKS 知识花园",
    pageTitleSuffix: " · FPKS",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "notes.zjnmcp.me",
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
          light: "#f6f4ec",
          lightgray: "#e4e0d3",
          gray: "#736e60",
          darkgray: "#3b382f",
          dark: "#26241e",
          secondary: "#a94f2d",
          tertiary: "#8a5a2b",
          highlight: "rgba(200, 100, 63, 0.1)",
          textHighlight: "#f0c96a66",
        },
        darkMode: {
          light: "#20201f",
          lightgray: "#38372f",
          gray: "#a09d92",
          darkgray: "#dcdad3",
          dark: "#f0efec",
          secondary: "#d97757",
          tertiary: "#e8a27f",
          highlight: "rgba(217, 119, 87, 0.14)",
          textHighlight: "#8d6f2e88",
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
      NavFont(),
      DedupeTitle(),
      Plugin.TableOfContents(),
      NoteRelativeLinks(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      FpksMath(),
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
      FpksMathAssets(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
