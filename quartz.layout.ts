import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import TopicGrid from "./quartz/components/TopicGrid"

const isHome = (slug: string | undefined) => slug === "index"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: TopicGrid(),
      condition: (page) => isHome(page.fileData.slug),
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/JianingZhangnan/website1",
    },
  }),
}

const breadcrumbs = Component.Breadcrumbs({ rootName: "首页" })

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: breadcrumbs,
      condition: (page) => !isHome(page.fileData.slug),
    }),
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isHome(page.fileData.slug),
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({ title: "知识目录" }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    // Rendered drawings have no links, so their graph panel would always be empty.
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => !page.fileData.frontmatter?.cssclasses?.includes("drawing"),
    }),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [breadcrumbs, Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ title: "知识目录" }),
  ],
  right: [],
}
