const records = (window.__ASTRO_HOMEWORK__ || []).filter(
  (item) =>
    item.course === "main" && ["homework", "question"].includes(item.classification?.category),
)
const category = (item) => item.classification.category
const categoryLabel = (item) => (category(item) === "homework" ? "作业" : "课堂问题")
const sectionOrder = { intro: 0, obs: 1, compact: 2 }
records.sort((a, b) => {
  const left = sectionOrder[String(a.id).split("-")[0]] ?? 9
  const right = sectionOrder[String(b.id).split("-")[0]] ?? 9
  return left - right || String(a.id).localeCompare(String(b.id), "zh-CN", { numeric: true })
})
const types = {
  all: "全部题型",
  calculation: "计算",
  derivation: "推导",
  research: "调研",
  open: "开放题",
}
const deepId =
  new URLSearchParams(location.search).get("id") || decodeURIComponent(location.hash.slice(1))
const state = {
  query: "",
  kind: "all",
  deck: "all",
  selected: records.some((item) => item.id === deepId) ? deepId : records[0]?.id,
}
const reader = document.querySelector("#reader")
const summary = document.querySelector("#summary")
const escapeHtml = (text) =>
  String(text ?? "").replace(
    /[&<>'"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char],
  )
const deck = (item) => item.source?.slideDeck || "未标注课件"
const deckLabels = {
  "2026.大学天文.0.Introduction_2026.09.08.pptx": "绪论",
  "2026.大学天文1.chapter1_2026.09.29.pptx": "天文观测与恒星参数",
  "2026.Chapter4_2026.11.17.s.pptx": "致密天体",
}
const deckLabel = (name) => deckLabels[name] || name
const searchText = (item) =>
  [item.id, item.chapter, item.title, item.prompt, item.solution, deck(item), ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
function matching() {
  const query = state.query.trim().toLowerCase()
  return records.filter(
    (item) =>
      (state.kind === "all" || item.kind === state.kind) &&
      (state.deck === "all" || deck(item) === state.deck) &&
      (!query || searchText(item).includes(query)),
  )
}
function renderDecks() {
  const decks = [...new Set(records.map(deck))]
  const count = Object.fromEntries(
    decks.map((name) => [name, records.filter((item) => deck(item) === name).length]),
  )
  document.querySelector("#deck-count").textContent =
    `${decks.length} 份课件 · ${records.filter((item) => category(item) === "homework").length} 项作业 · ${records.filter((item) => category(item) === "question").length} 个问题`
  document.querySelector("#deck-nav").innerHTML = [
    `<button class="deck ${state.deck === "all" ? "active" : ""}" data-deck="all"><span>全部课件题目</span><b>${records.length}</b></button>`,
    ...decks.map(
      (name) =>
        `<button class="deck ${state.deck === name ? "active" : ""}" data-deck="${escapeHtml(name)}" title="${escapeHtml(name)}"><span>${escapeHtml(deckLabel(name))}</span><b>${count[name]}</b></button>`,
    ),
  ].join("")
  document.querySelectorAll(".deck").forEach((button) =>
    button.addEventListener("click", () => {
      state.deck = button.dataset.deck
      render()
    }),
  )
}
function renderFilters() {
  const root = document.querySelector("#filters")
  root.innerHTML = Object.entries(types)
    .map(
      ([key, label]) =>
        `<button class="filter ${state.kind === key ? "active" : ""}" data-kind="${key}" type="button">${label}</button>`,
    )
    .join("")
  root.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      state.kind = button.dataset.kind
      render()
    }),
  )
}
function renderList(items, group) {
  const list = document.querySelector(`#${group}-list`)
  const grouped = items.filter((item) => category(item) === group)
  document.querySelector(`#${group}-count`).textContent =
    `${grouped.length} / ${records.filter((item) => category(item) === group).length}`
  list.innerHTML =
    grouped
      .map((item) => {
        const open = item.status === "open" || item.kind === "open"
        const source = item.source || {}
        return `<li><button class="problem-row ${state.selected === item.id ? "selected" : ""}" data-id="${escapeHtml(item.id)}"><span class="row-top"><code>${escapeHtml(item.id)}</code><em class="${open ? "open" : ""}">${escapeHtml(types[item.kind] || "题目")}</em><small>P${escapeHtml(source.slide || "-")}</small></span><strong>${escapeHtml(item.title)}</strong><span class="row-source">${escapeHtml(deck(item))}</span></button></li>`
      })
      .join("") || `<li class="empty">没有匹配的题目。</li>`
  list.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      state.selected = button.dataset.id
      render()
      if (innerWidth < 960) reader.scrollIntoView({ behavior: "smooth", block: "start" })
    }),
  )
}
function renderReader(items) {
  const item = records.find((entry) => entry.id === state.selected) || items[0]
  if (!item) {
    reader.innerHTML = `<p class="empty">没有匹配的题目。</p>`
    return
  }
  state.selected = item.id
  if (location.hash.slice(1) !== encodeURIComponent(item.id)) {
    history.replaceState(null, "", `#${encodeURIComponent(item.id)}`)
  }
  const source = item.source || {}
  const open = item.status === "open" || item.kind === "open"
  const tags = (item.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("")
  const submission = `<section class="submission-panel" aria-label="${category(item) === "homework" ? "作业提交" : "课程通用提交入口"}">${item.submissions
    .map(
      (entry) =>
        `<div class="submission-option"><a class="submission-link" href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.label)}</a><span class="submission-note">${escapeHtml(entry.note)}</span></div>`,
    )
    .join("")}</section>`
  const evidence = item.classification.evidence
    .map((entry) => {
      const quote = String(entry.quote)
      const excerpt = quote.length > 48 ? `${quote.slice(0, 48)}…` : quote
      return `P${escapeHtml(entry.source.slide)} ${entry.type === "submission-link" ? "明示提交入口" : `原文「${escapeHtml(excerpt)}」`}`
    })
    .join("；")
  const solution = open
    ? `<p class="open-note">此为开放式${category(item) === "homework" ? "任务" : "问题"}，页面保留 PPT 中的原始要求。</p>`
    : item.solutionHtml || `<p>解答正在整理。</p>`
  reader.innerHTML = `<article class="problem-article" data-category="${category(item)}"><header class="problem-header"><div class="problem-meta"><code>${escapeHtml(item.id)}</code><span class="badge">${categoryLabel(item)}</span><span class="badge ${open ? "open" : ""}">${open ? "开放题" : types[item.kind] || "题目"}</span><span>${escapeHtml(item.chapter || "未分章")}</span></div><h2>${escapeHtml(item.title)}</h2><div class="source-bar"><span>来源课件：${escapeHtml(deck(item))}</span><span>页码：P${escapeHtml(source.slide || "待核对")}</span>${tags}</div><p class="classification-note">${category(item) === "homework" ? "作业依据" : "课堂提问"}：${evidence}</p>${submission}</header><section class="prose"><h3>题面</h3>${item.promptHtml || ""}</section><details class="solution-panel" ${open ? "" : "open"}><summary>${open ? "查看任务要求" : "查看参考解答"}</summary><div class="solution-body prose">${solution}</div></details></article>`
}
function render() {
  const items = matching()
  if (!items.some((item) => item.id === state.selected)) state.selected = items[0]?.id
  const labels = [state.kind !== "all" && types[state.kind]].filter(Boolean)
  summary.innerHTML = `<strong>${items.length}</strong> / ${records.length} 项${labels.length ? ` · ${labels.join(" / ")}` : ""}`
  renderDecks()
  renderFilters()
  renderList(items, "homework")
  renderList(items, "question")
  renderReader(items)
}
document.querySelector("#query").addEventListener("input", (event) => {
  state.query = event.target.value
  render()
})
document
  .querySelector("#theme")
  .addEventListener("click", () => document.documentElement.classList.toggle("manual-dark"))
render()
