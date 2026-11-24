const data = window.__ASTRO_FINAL__
const base = "/static/astro-final/"
const labels = {
  fill: "一、填空题",
  judge: "二、判断是非题",
  choice: "三、单选题",
  essay: "四、说明与论述题",
}
const statuses = { found: "已定位", partial: "部分查不到", missing: "查不到" }
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  )
const papers = new Map(data.papers.map((p) => [p.id, p]))
const selectedId = decodeURIComponent(location.hash.slice(1))
const state = {
  paper: "all",
  section: "all",
  status: "all",
  query: "",
  selected: data.questions.some((q) => q.id === selectedId) ? selectedId : data.questions[0].id,
}
const reader = document.querySelector("#reader")
const list = document.querySelector("#question-list")
const scopeCounts = Object.fromEntries(
  Object.keys(statuses).map((key) => [key, data.questions.filter((q) => q.status === key).length]),
)
document.querySelector("#total").textContent =
  `${data.papers.length}份试卷 · ${data.questions.length}道题`
document.querySelector("#paper").innerHTML += data.papers
  .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.title)}</option>`)
  .join("")
document.querySelector("#decks").innerHTML = data.decks
  .map((d) => `<li>${escapeHtml(d.file)}（${d.kind}，${d.pages}页）</li>`)
  .join("")

function matching() {
  const query = state.query.trim().toLowerCase()
  return data.questions.filter(
    (q) =>
      (state.paper === "all" || q.paper === state.paper) &&
      (state.section === "all" || q.section === state.section) &&
      (state.status === "all" ||
        q.status === state.status ||
        (state.status === "gaps" && q.status !== "found")) &&
      (!query ||
        [papers.get(q.paper).title, q.id, q.title, q.searchText]
          .join(" ")
          .toLowerCase()
          .includes(query)),
  )
}

function render() {
  const items = matching()
  if (!items.some((q) => q.id === state.selected)) state.selected = items[0]?.id
  document.querySelector("#summary").textContent = `题目索引 · ${items.length}题`
  const parts = []
  let lastGroup = ""
  for (const q of items) {
    const group = `${q.paper}-${q.section}`
    if (group !== lastGroup) {
      parts.push(
        `<h2 class="list-heading">${escapeHtml(papers.get(q.paper).title)}<span>${labels[q.section]}</span></h2>`,
      )
      lastGroup = group
    }
    parts.push(`<button type="button" class="question${q.id === state.selected ? " selected" : ""}" data-id="${escapeHtml(q.id)}" ${q.id === state.selected ? 'aria-current="true"' : ""}>
      <span class="question-number">${escapeHtml(q.number)}</span><span class="question-text">${escapeHtml(q.title)}<small class="status ${q.status}">${statuses[q.status]}</small></span></button>`)
  }
  list.innerHTML = parts.length ? parts.join("") : '<p class="empty">没有符合筛选条件的题目。</p>'
  renderQuestion(items)
}

function renderQuestion(items) {
  const index = items.findIndex((q) => q.id === state.selected)
  const q = items[index]
  if (!q) {
    reader.innerHTML = '<p class="empty">请调整搜索词或筛选条件。</p>'
    return
  }
  const pageSet = [...new Set(q.fragments.map((f) => f.page))]
  const fragments = q.fragments
    .map(
      (f, i) => `<figure class="exam-fragment">
        <p class="image-hint">题面可横向滑动，点击可放大。</p>
        <a href="${base + f.asset}" target="_blank" rel="noopener" aria-label="放大第${q.number}题${q.fragments.length > 1 ? `，第${i + 1}部分` : ""}">
          <img src="${base + f.asset}" width="${f.imageWidth}" height="${f.imageHeight}" alt="原卷题面：${escapeHtml(q.title)}${q.fragments.length > 1 ? `（第${i + 1}部分）` : ""}" />
        </a><figcaption>原卷PDF第${f.page}页${q.fragments.length > 1 ? ` · 第${i + 1}部分` : ""} · <a href="${base + f.original}" target="_blank" rel="noopener">查看原卷页${data.panels.some((p) => p.file === q.sourceFile && p.page === f.page && p.side === 1) ? (f.side === 1 ? "右半页" : "左半页") : ""}</a></figcaption>
      </figure>`,
    )
    .join("")
  const topics = q.topics
    .map((code) => {
      const t = data.topics[code]
      const status = t.sources.length ? (t.missing ? "partial" : "found") : "missing"
      const grouped = new Map()
      t.sources.forEach((s) => {
        if (!grouped.has(s.file)) grouped.set(s.file, [])
        grouped.get(s.file).push(s)
      })
      const sources = [...grouped.entries()]
        .map(
          ([file, refs]) =>
            `<div class="source-file"><p>${refs[0].kind} · ${escapeHtml(file)}</p><div class="source-pages">${refs
              .map(
                (s) =>
                  `<button type="button" data-topic="${code}" data-asset="${s.asset}">第${s.page}页 ↗</button>`,
              )
              .join("")}</div></div>`,
        )
        .join("")
      return `<section class="topic"><h3>${escapeHtml(t.title)}<span class="status ${status}">${statuses[status]}</span></h3>${sources}${t.note ? `<p class="source-note">${escapeHtml(t.note)}</p>` : ""}</section>`
    })
    .join("")
  reader.innerHTML = `<div class="reader-top"><p class="eyebrow">${escapeHtml(papers.get(q.paper).title)} · ${labels[q.section]}</p><span class="status ${q.status}">${statuses[q.status]}</span></div>
    <h2 class="question-title">第${escapeHtml(q.number)}题</h2><p class="topic-title">${escapeHtml(q.title)}</p>
    <div class="pager"><button type="button" id="prev" ${index <= 0 ? "disabled" : ""}>← 上一题</button><span>筛选结果 ${index + 1} / ${items.length}</span><button type="button" id="next" ${index >= items.length - 1 ? "disabled" : ""}>下一题 →</button></div>
    ${fragments}<p class="provenance">来源：${escapeHtml(q.sourceFile)} · PDF第${pageSet.join("、")}页</p>
    <h2 class="reference-heading">课件中的位置</h2>${topics}
    <p class="scope-footer">核对范围：2026年《大学天文学》3份PPT、6份PDF课件。共${scopeCounts.found}题已定位、${scopeCounts.partial}题部分查不到、${scopeCounts.missing}题查不到。更新于${data.updated}。</p>`
  document.querySelector("#prev").onclick = () => select(items[index - 1]?.id)
  document.querySelector("#next").onclick = () => select(items[index + 1]?.id)
}

function select(id) {
  if (!id) return
  state.selected = id
  history.replaceState(null, "", `#${encodeURIComponent(id)}`)
  render()
  if (matchMedia("(max-width: 800px)").matches) {
    document.querySelector("#question-nav").open = false
    reader.scrollIntoView({ block: "start" })
  } else reader.scrollTop = 0
}
list.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-id]")
  if (target) select(target.dataset.id)
})
for (const name of ["paper", "section", "status", "query"]) {
  document
    .querySelector(`#${name}`)
    .addEventListener(name === "query" ? "input" : "change", (event) => {
      state[name] = event.target.value
      document.querySelector("#question-nav").open = true
      render()
    })
}
window.addEventListener("hashchange", () => {
  const id = decodeURIComponent(location.hash.slice(1))
  if (data.questions.some((q) => q.id === id)) {
    state.paper = "all"
    state.section = "all"
    state.status = "all"
    state.query = ""
    for (const name of ["paper", "section", "status", "query"])
      document.querySelector(`#${name}`).value = state[name]
    state.selected = id
    render()
  }
})
const dialog = document.querySelector("#source-dialog")
reader.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-asset]")
  if (!target) return
  const t = data.topics[target.dataset.topic]
  const source = t.sources.find((s) => s.asset === target.dataset.asset)
  document.querySelector("#source-title").textContent =
    `${t.title} · ${source.kind}第${source.page}页`
  document.querySelector("#source-file").textContent = source.file
  document.querySelector("#source-image").src = base + source.asset
  document.querySelector("#source-image").alt = `${source.file}，第${source.page}页`
  document.querySelector("#source-original").href = base + source.asset
  dialog.showModal()
})
document.querySelector("#close-source").onclick = () => dialog.close()
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close()
})
const storedTheme = localStorage.getItem("fpks-astro-final-theme")
if (storedTheme) document.documentElement.dataset.theme = storedTheme
document.querySelector("#theme").onclick = () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.dataset.theme = dark ? "light" : "dark"
  localStorage.setItem("fpks-astro-final-theme", dark ? "light" : "dark")
}
render()
