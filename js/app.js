/* ScaleLab — ứng dụng tĩnh, không build, không backend */
(function () {
  "use strict";

  const SL = window.SCALELAB;
  if (!SL) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVGNS = "http://www.w3.org/2000/svg";
  const PROGRESS_KEY = "scalelab:progress:v1";
  const THEME_KEY = "scalelab:theme";
  const LAST_KEY = "scalelab:last-lesson";
  const AUTO_MS = 7600;

  const ICON_PATHS = {
    client: '<circle cx="10" cy="6.5" r="3.2"/><path d="M4 17c.6-3.2 3-5 6-5s5.4 1.8 6 5"/>',
    dns: '<circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2.2 2 3.4 4.4 3.4 7s-1.2 5-3.4 7c-2.2-2-3.4-4.4-3.4-7S7.8 5 10 3Z"/>',
    lb: '<rect x="3" y="3.5" width="14" height="4" rx="1.3"/><rect x="3" y="12.5" width="5.5" height="4" rx="1"/><rect x="11.5" y="12.5" width="5.5" height="4" rx="1"/><path d="M10 7.5v2.5M6 12.5v-2.5h8v2.5"/>',
    server: '<rect x="3" y="3" width="14" height="5.5" rx="1.5"/><rect x="3" y="11.5" width="14" height="5.5" rx="1.5"/><path d="M6 5.8h.01M6 14.2h.01M9 5.8h5M9 14.2h5"/>',
    cache: '<path d="m11 2-6 9h4l-1 7 7-10h-4l1-6Z"/>',
    db: '<ellipse cx="10" cy="4.8" rx="6.5" ry="2.6"/><path d="M3.5 4.8v10.4c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V4.8M3.5 10c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6"/>',
    queue: '<path d="M3 5h14M3 10h14M3 15h9"/><circle cx="16" cy="15" r="1.2"/>',
    worker: '<circle cx="10" cy="10" r="3"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4"/>',
    cdn: '<path d="M5.5 15.5h9a3.2 3.2 0 0 0 .5-6.4 5 5 0 0 0-9.7-1.2A3.8 3.8 0 0 0 5.5 15.5Z"/>',
    gateway: '<rect x="3" y="3" width="14" height="14" rx="2.5"/><path d="M7 10h6M10 7v6"/>',
    router: '<circle cx="5" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="10" cy="15" r="2"/><path d="M6.5 6.5 9 13M13.5 6.5 11 13M7 5h6"/>',
    store: '<path d="M3 7.5V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7.5M2.5 7.5h15l-1.2-4H3.7l-1.2 4Z"/><path d="M8 9v5h4V9"/>',
    presence: '<path d="M3 10a7 7 0 0 1 14 0M6 10a4 4 0 0 1 8 0M9 10a1 1 0 1 0 2 0"/>',
    book: '<path d="M3 4.5h5.5A2.5 2.5 0 0 1 11 7v9a2.5 2.5 0 0 0-2.5-2H3zM17 4.5h-3.5A2.5 2.5 0 0 0 11 7v9a2.5 2.5 0 0 1 2.5-2H17z"/>',
    star: '<path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.7l5.4-.8z"/>',
    flask: '<path d="M8 2v5.2L3.4 15a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L12 7.2V2M6 2h8M6.5 11h7"/>',
    file: '<path d="M5 2.5h8a2 2 0 0 1 2 2v13H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm3 4h4M8 10h4M8 13.5h2.5"/>',
    bulb: '<path d="M7.2 14.2h5.6M8 17h4M10 2.5a5 5 0 0 0-3 9v1.7h6V11.5a5 5 0 0 0-3-9Z"/>',
    check: '<path d="m4 10 4 4 8-8"/>',
    code: '<path d="m7 5-4 5 4 5M13 5l4 5-4 5"/>',
    commit: '<circle cx="10" cy="10" r="3"/><path d="M10 2v5M10 13v5"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="14" cy="8" r="2"/><path d="M6 7v6M8 5h2a2 2 0 0 1 2 2v1"/>',
    merge: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="14" cy="10" r="2"/><path d="M8 5h2a2 2 0 0 1 2 2v1M8 15h2a2 2 0 0 0 2-2v-1"/>',
    build: '<path d="M4 16V8l6-4 6 4v8l-6 4-6-4Z"/><path d="M4 8l6 4 6-4M10 12v8"/>',
    artifact: '<path d="M5 2.5h6l4 4v11H5z"/><path d="M11 2.5v4h4M8 11h4M8 14h4"/>',
    deploy: '<path d="M10 2.5c2.6 1.8 4 4.3 4 7.2L10 14l-4-4.3c0-2.9 1.4-5.4 4-7.2Z"/><path d="M7.8 13.5 6 17l3.2-1M12.2 13.5 14 17l-3.2-1M10 8.5h.01"/>',
    monitor: '<path d="M2.5 10h3.5l1.5-4 3 8 1.8-4h5.2"/>',
    gate: '<rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9M10 12.5v1.5"/>',
    shield: '<path d="M10 2.5 16 5v5c0 3.5-2.4 6-6 7.5C7.4 16 5 13.5 5 10V5l5-2.5Z"/><path d="m7.5 10 1.8 1.8 3.4-3.4"/>',
    test: '<rect x="3.5" y="3.5" width="13" height="13" rx="3"/><path d="m6.5 10 2.2 2.2 4.8-4.8"/>',
    rollback: '<path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5V7h3.5"/>',
    arrow: '<path d="M4 10h12M11 5l5 5-5 5"/>',
    info: '<circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.5h.01"/>'
  };

  const UI_ICONS = {
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 3.5 16 10 6.5 16.5Z"/></svg>',
    pause: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3.5h3.5v13H5zM11.5 3.5H15v13h-3.5z"/></svg>',
    replay: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5V7h3.5"/></svg>',
    prev: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
    next: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>',
    full: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4"/></svg>',
    info: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.5h.01"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>',
    minus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12"/></svg>',
    left: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg>',
    right: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>',
    trash: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 3.5h4M6 6l.8 11h6.4L14 6M8.5 9v5M11.5 9v5"/></svg>',
    search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.8 3.8"/></svg>'
  };

  const TONE_COLORS = {
    blue: "var(--blue)",
    coral: "var(--coral)",
    green: "var(--green)",
    violet: "var(--violet)",
    yellow: "var(--yellow)",
    mint: "var(--mint)"
  };

  const TONE_SWATCH = {
    blue: "var(--blue-soft)",
    coral: "var(--coral-soft)",
    green: "var(--green-soft)",
    violet: "var(--violet-soft)",
    yellow: "var(--yellow-soft)",
    mint: "var(--mint-soft)"
  };

  const NODE_TONES = {
    client: "blue",
    dns: "violet",
    lb: "coral",
    server: "blue",
    cache: "yellow",
    db: "green",
    queue: "violet",
    worker: "coral",
    cdn: "green",
    gateway: "coral",
    router: "violet",
    store: "green",
    presence: "violet",
    code: "blue",
    commit: "green",
    branch: "violet",
    merge: "mint",
    build: "coral",
    artifact: "yellow",
    deploy: "coral",
    monitor: "blue",
    gate: "violet",
    shield: "green",
    test: "blue",
    rollback: "coral",
    file: "yellow",
    bulb: "yellow",
    check: "green",
    book: "blue",
    star: "yellow",
    flask: "violet",
    arrow: "blue",
    info: "violet"
  };

  const view = $("#view");
  const sidebarNav = $("#sidebarNav");
  const searchModal = $("#searchModal");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");
  const toastEl = $("#toast");

  const state = {
    route: { view: "home" },
    progress: loadProgress(),
    lesson: { id: null, step: 1, playing: false, speed: 1, timer: null },
    practice: null,
    lab: null,
    cheat: { section: "numbers", query: "" },
    search: { items: [], selected: 0, modalOpen: false },
    diagram: null,
    revealObserver: null
  };

  const moduleMap = {};
  const lessonList = [];
  SL.modules.forEach((m) => {
    moduleMap[m.id] = m;
    m.lessons.forEach((id) => {
      const lesson = SL.lessons[id];
      if (!lesson) return;
      lesson.module = m.id;
      lessonList.push(lesson);
    });
  });
  const lessonById = SL.lessons;
  const totalLessons = lessonList.length;
  const totalSteps = lessonList.reduce((sum, l) => sum + l.steps.length, 0);

  let searchIndex = [];
  let toastTimer = null;
  let sidebarReturnFocus = null;

  /* ----------------------------------------------------------
     Utilities
     ---------------------------------------------------------- */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  function formatInt(n) {
    return Math.round(n).toLocaleString("vi-VN");
  }

  function iconMarkup(name, cls) {
    const inner = ICON_PATHS[name] || ICON_PATHS.info;
    return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }

  function toneVars(tone) {
    const t = TONE_COLORS[tone] ? tone : "blue";
    return `--mc:${TONE_COLORS[t]};--mc-soft:${TONE_SWATCH[t]}`;
  }

  function nodeTone(type) {
    return NODE_TONES[type] || "blue";
  }

  function nodeToneVars(type) {
    const t = nodeTone(type);
    return `--tone:${TONE_COLORS[t]};--tone-soft:${TONE_SWATCH[t]}`;
  }

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return raw && typeof raw === "object" ? raw : {};
    } catch (err) {
      return {};
    }
  }

  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); } catch (err) { /* private mode */ }
  }

  function isComplete(id) {
    const lesson = lessonById[id];
    if (!lesson) return false;
    return (state.progress[id] || 0) >= lesson.steps.length;
  }

  function savedStep(id) {
    const lesson = lessonById[id];
    if (!lesson) return 1;
    return clamp(state.progress[id] || 1, 1, lesson.steps.length);
  }

  function completedCount() {
    return lessonList.filter((l) => isComplete(l.id)).length;
  }

  function nextLessonOf(id) {
    const idx = lessonList.findIndex((l) => l.id === id);
    return idx >= 0 ? lessonList[idx + 1] || null : null;
  }

  function resumeLesson() {
    try {
      const last = localStorage.getItem(LAST_KEY);
      if (last && lessonById[last]) return lessonById[last];
    } catch (err) { /* ignore */ }
    return lessonList.find((l) => !isComplete(l.id)) || lessonList[0];
  }

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  function navigate(hash) {
    if (location.hash === hash) {
      onRoute();
    } else {
      location.hash = hash;
    }
  }

  /* ----------------------------------------------------------
     Theme
     ---------------------------------------------------------- */
  function initTheme() {
    let theme = "light";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") theme = stored;
    } catch (err) { /* ignore */ }
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080f19" : "#0c1624");
  }

  function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#080f19" : "#0c1624");
  }

  /* ----------------------------------------------------------
     Chrome / sidebar
     ---------------------------------------------------------- */
  function updateChrome() {
    const completed = completedCount();
    const pct = totalLessons ? completed / totalLessons : 0;
    const ring = $("#ringFill");
    if (ring) ring.style.strokeDashoffset = String(91.1 * (1 - pct));
    const globalText = $("#globalProgressText");
    if (globalText) globalText.textContent = `${completed}/${totalLessons}`;
    const sideFill = $("#sidebarProgressFill");
    if (sideFill) sideFill.style.width = `${Math.round(pct * 100)}%`;
    const sideText = $("#sidebarProgressText");
    if (sideText) sideText.textContent = `${completed}/${totalLessons} bài`;

    $$(".mode-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.mode === state.route.view);
    });
    renderSidebar();
  }

  function renderSidebar() {
    if (!sidebarNav) return;
    const activeId = state.route.view === "learn" ? state.route.lessonId : null;
    sidebarNav.innerHTML = SL.modules.map((m) => {
      const moduleLessons = m.lessons
        .map((id) => lessonById[id])
        .filter(Boolean);
      if (!moduleLessons.length) return "";
      return `
        <div class="side-module">
          <div class="side-module-head">
            <span class="side-module-num">${esc(m.num)}</span>
            <span>${esc(m.title)}</span>
          </div>
          ${moduleLessons.map((lesson) => {
            const done = isComplete(lesson.id);
            const active = lesson.id === activeId;
            const step = savedStep(lesson.id);
            return `
              <a class="side-lesson${active ? " is-active" : ""}${done ? " is-done" : ""}"
                 href="#/learn/${esc(lesson.id)}/${step}" data-lesson-link>
                <span class="side-lesson-num">${done ? "✓" : lessonList.indexOf(lesson) + 1}</span>
                <span class="side-lesson-body">
                  <span class="side-lesson-title">${esc(lesson.title)}</span>
                  <span class="side-lesson-meta">${esc(lesson.duration)} · ${lesson.steps.length} bước</span>
                </span>
              </a>`;
          }).join("")}
        </div>`;
    }).join("");
  }

  function openSidebar() {
    sidebarReturnFocus = document.activeElement;
    document.body.classList.add("sidebar-open");
    $("#sidebarScrim").hidden = false;
    $("#menuBtn").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    $("#sidebarScrim").hidden = true;
    $("#menuBtn").setAttribute("aria-expanded", "false");
    if (sidebarReturnFocus && typeof sidebarReturnFocus.focus === "function") sidebarReturnFocus.focus();
    sidebarReturnFocus = null;
  }

  function toggleSidebar() {
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
    else openSidebar();
  }

  function syncTopbarOffset() {
    const bar = document.querySelector(".topbar");
    if (!bar) return;
    document.documentElement.style.setProperty("--topbar-offset", `${bar.offsetHeight}px`);
  }

  /* ----------------------------------------------------------
     Router
     ---------------------------------------------------------- */
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { view: "home" };
    if (parts[0] === "learn") {
      if (!parts[1]) return { view: "learn", lessonId: null, step: 1 };
      const lesson = lessonById[parts[1]];
      if (!lesson) return { view: "missing" };
      const step = clamp(parseInt(parts[2] || "1", 10) || 1, 1, lesson.steps.length);
      return { view: "learn", lessonId: lesson.id, step };
    }
    if (parts[0] === "practice") return { view: "practice" };
    if (parts[0] === "lab") return { view: "lab" };
    if (parts[0] === "cheatsheets") {
      const section = SL.cheatsheets.find((s) => s.id === parts[1]);
      return { view: "cheatsheets", section: section ? section.id : null };
    }
    return { view: "missing" };
  }

  function onRoute() {
    const route = parseRoute();
    if (route.view === "learn" && !route.lessonId) {
      const resume = resumeLesson();
      if (resume) {
        const step = savedStep(resume.id);
        location.hash = `#/learn/${resume.id}/${step}`;
        return;
      }
    }
    if (route.view === "cheatsheets") {
      const valid = route.section || (SL.cheatsheets.some((s) => s.id === state.cheat.section) ? state.cheat.section : SL.cheatsheets[0].id);
      state.cheat.section = valid;
    }
    state.route = route;
    stopPlayer();
    document.body.dataset.view = route.view;
    closeSidebar();
    closeSearch();

    if (route.view === "home") renderHome();
    else if (route.view === "learn") renderLesson(route.lessonId, route.step);
    else if (route.view === "practice") renderPractice();
    else if (route.view === "lab") renderLab();
    else if (route.view === "cheatsheets") renderCheatsheets();
    else renderMissing();

    updateChrome();
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------
     Search
     ---------------------------------------------------------- */
  function buildSearchIndex() {
    const index = [];
    lessonList.forEach((lesson) => {
      const mod = moduleMap[lesson.module];
      index.push({
        kind: "lesson",
        href: `#/learn/${lesson.id}/1`,
        title: lesson.title,
        sub: `${mod.num} · ${mod.title} · ${lesson.duration}`,
        haystack: `${lesson.title} ${lesson.shortTitle} ${lesson.subtitle} ${lesson.tags.join(" ")} ${mod.title}`.toLowerCase()
      });
      lesson.steps.forEach((step, i) => {
        index.push({
          kind: "step",
          href: `#/learn/${lesson.id}/${i + 1}`,
          title: step.title,
          sub: `${lesson.shortTitle} · bước ${i + 1} · ${step.type}`,
          haystack: `${lesson.title} ${lesson.shortTitle} ${step.title} ${step.short} ${step.type} ${stripHTML(step.body)}`.toLowerCase()
        });
      });
    });
    SL.cheatsheets.forEach((section) => {
      section.cards.forEach((card) => {
        index.push({
          kind: "cheat",
          href: `#/cheatsheets/${section.id}`,
          title: card.title,
          sub: `${section.title} · cheatsheet`,
          haystack: `${section.title} ${card.title} ${stripHTML(card.html)}`.toLowerCase()
        });
      });
    });
    searchIndex = index;
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    document.body.classList.add("has-modal");
    state.search.modalOpen = true;
    searchInput.value = "";
    renderSearchResults("");
    setTimeout(() => searchInput.focus(), 30);
  }

  function closeSearch() {
    if (!searchModal || searchModal.hidden) return;
    searchModal.hidden = true;
    document.body.classList.remove("has-modal");
    state.search.modalOpen = false;
  }

  function searchResultsFor(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      const lessons = lessonList.slice(0, 5).map((lesson) => {
        const mod = moduleMap[lesson.module];
        return {
          kind: "lesson",
          href: `#/learn/${lesson.id}/1`,
          title: lesson.title,
          sub: `${mod.num} · ${mod.title} · ${lesson.duration}`
        };
      });
      const cheats = SL.cheatsheets.slice(0, 3).map((s) => ({
        kind: "cheat",
        href: `#/cheatsheets/${s.id}`,
        title: s.title,
        sub: "Cheatsheet · công thức & bảng tra"
      }));
      return lessons.concat(cheats);
    }
    return searchIndex
      .filter((item) => item.haystack.includes(q))
      .sort((a, b) => {
        const at = a.title.toLowerCase().indexOf(q);
        const bt = b.title.toLowerCase().indexOf(q);
        if (at >= 0 && bt < 0) return -1;
        if (bt >= 0 && at < 0) return 1;
        const rank = { lesson: 0, step: 1, cheat: 2 };
        return (rank[a.kind] - rank[b.kind]) || a.title.localeCompare(b.title, "vi");
      })
      .slice(0, 16);
  }

  function renderSearchResults(query) {
    const items = searchResultsFor(query);
    if (!items.length) {
      state.search.items = [];
      state.search.selected = -1;
      searchResults.innerHTML = `<div class="search-empty">Không tìm thấy kết quả cho “${esc(query)}”.<br>Thử “cache”, “shard”, “queue” hoặc “p95”.</div>`;
      return;
    }
    const groups = { lesson: "Bài học", step: "Bước trong bài", cheat: "Cheatsheets" };
    const ordered = [];
    let html = "";
    ["lesson", "step", "cheat"].forEach((kind) => {
      const group = items.filter((item) => item.kind === kind);
      if (!group.length) return;
      html += `<div class="search-group-title">${groups[kind]}</div>`;
      group.forEach((item) => {
        const index = ordered.length;
        ordered.push(item);
        const badge = kind === "lesson" ? iconMarkup("book") : kind === "cheat" ? "C" : "↳";
        html += `
          <a class="search-result${index === 0 ? " is-selected" : ""}" href="${item.href}" data-search-item="${index}">
            <span class="search-result-icon${kind === "cheat" ? " cheat" : ""}">${badge}</span>
            <span class="search-result-body">
              <span class="search-result-title">${esc(item.title)}</span>
              <span class="search-result-sub">${esc(item.sub)}</span>
            </span>
            <span class="search-result-kbd">↵</span>
          </a>`;
      });
    });
    state.search.items = ordered;
    state.search.selected = 0;
    searchResults.innerHTML = html;
  }

  function moveSearchSelection(delta) {
    if (!state.search.items.length) return;
    state.search.selected = (state.search.selected + delta + state.search.items.length) % state.search.items.length;
    $$(".search-result", searchResults).forEach((el, i) => {
      el.classList.toggle("is-selected", i === state.search.selected);
      if (i === state.search.selected) el.scrollIntoView({ block: "nearest" });
    });
  }

  function activateSearchSelection() {
    if (state.search.selected < 0) return;
    const links = $$(".search-result", searchResults);
    const el = links[state.search.selected];
    if (el) {
      closeSearch();
      location.hash = el.getAttribute("href");
    }
  }

  /* ----------------------------------------------------------
     Home
     ---------------------------------------------------------- */
  function renderHome() {
    document.title = "ScaleLab — Thiết kế hệ thống, nhìn thấy từng bước";
    const completed = completedCount();
    const resume = resumeLesson();
    const resumeStep = resume ? savedStep(resume.id) : 1;
    const resumeHref = resume ? `#/learn/${resume.id}/${resumeStep}` : "#/learn";
    const featured = lessonList.find((l) => !isComplete(l.id)) || lessonList[0];

    const modes = [
      {
        title: "Học bằng sơ đồ sống",
        desc: "Từng bước được làm nổi bật, số liệu thay đổi ngay trước mắt.",
        href: "#/learn",
        icon: "book",
        tone: "blue",
        cta: "Vào lớp học"
      },
      {
        title: "Luyện tập tình huống",
        desc: `${SL.practice.length} ca tình huống: chẩn đoán nút thắt, Git và CI/CD.`,
        href: "#/practice",
        icon: "star",
        tone: "coral",
        cta: "Bắt đầu luyện"
      },
      {
        title: "Design Lab",
        desc: "Tự ghép pipeline, kéo traffic và xem nút thắt xuất hiện.",
        href: "#/lab",
        icon: "flask",
        tone: "violet",
        cta: "Mở phòng lab"
      },
      {
        title: "Cheatsheets",
        desc: "Số liệu, công thức và máy tính dung lượng để tra nhanh.",
        href: "#/cheatsheets",
        icon: "file",
        tone: "green",
        cta: "Mở bảng tra"
      }
    ];

    view.innerHTML = `
      <div class="home">
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow">Khóa học tương tác · ${totalLessons} bài · tiếng Việt</span>
            <h1>Thiết kế hệ thống.<br><span class="hl">Nhìn thấy</span> từng bước.</h1>
            <p class="hero-sub">Theo chân một request qua DNS, load balancer, cache, database và queue. Mỗi bài là <strong>một sơ đồ sống</strong>, mỗi bước là một quyết định — học bằng cách nhìn thấy hệ thống thay đổi.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${resumeHref}">${completed ? "Tiếp tục học" : "Bắt đầu bài 01"} ${UI_ICONS.arrow}</a>
              <a class="btn btn-ghost" href="#/lab">${iconMarkup("flask")} Mở Design Lab</a>
            </div>
            <div class="hero-note">${UI_ICONS.check} Không cần backend. Tiến độ lưu ngay trên trình duyệt.</div>
            <div class="hero-stats">
              <div class="hero-stat"><b>${totalLessons}</b><span>bài học tương tác</span></div>
              <div class="hero-stat"><b>${totalSteps}</b><span>bước có sơ đồ</span></div>
              <div class="hero-stat"><b>4</b><span>chế độ thực hành</span></div>
              <div class="hero-stat"><b>${completed}/${totalLessons}</b><span>tiến độ của bạn</span></div>
            </div>
          </div>
          ${heroVisual()}
        </section>

        <section class="reveal">
          <div class="section-head">
            <div>
              <h2>Bốn cách học, một hệ thống</h2>
              <p>Không chỉ đọc lý thuyết. Bạn xem, thử, làm sai và sửa ngay trong cùng một giao diện.</p>
            </div>
            <a class="section-link" href="#/learn">Xem lộ trình ${UI_ICONS.arrow}</a>
          </div>
          <div class="mode-grid">
            ${modes.map((m) => `
              <a class="mode-card" href="${m.href}" style="${toneVars(m.tone)}">
                <span class="mode-icon">${iconMarkup(m.icon)}</span>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
                <span class="mode-arrow">${m.cta} ${UI_ICONS.arrow}</span>
              </a>`).join("")}
          </div>
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Lộ trình ${totalLessons} bài</h2>
              <p>Đi từ nền tảng đến hệ thống hoàn chỉnh. Mỗi bài mở khóa bằng sự tò mò, không bằng thanh toán.</p>
            </div>
            <a class="section-link" href="#/learn/${featured.id}/1">Học bài tiếp theo ${UI_ICONS.arrow}</a>
          </div>
          <div class="outline-grid">
            ${SL.modules.map((m) => outlineModule(m)).join("")}
          </div>
        </section>

        <section class="reveal">
          ${labPromo()}
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Câu hỏi thường gặp</h2>
              <p>Vài điều cần biết trước khi dùng trên lớp hoặc tự học.</p>
            </div>
          </div>
          <div class="faq-list">
            <details class="faq-item">
              <summary>Có cần cài backend hay database không?</summary>
              <p>Không. Toàn bộ site là HTML, CSS và JavaScript tĩnh. Tiến độ học được lưu bằng localStorage trên máy bạn; không có dữ liệu nào gửi lên server.</p>
            </details>
            <details class="faq-item">
              <summary>Nội dung có phải bản sao của designedtoscale.app?</summary>
              <p>Không. Mình nghiên cứu mô hình tương tác (bài học theo bước, sidebar, sơ đồ, lab) rồi viết một khóa system design gốc bằng tiếng Việt. Nội dung, sơ đồ, màu sắc và thương hiệu đều được làm mới.</p>
            </details>
            <details class="faq-item">
              <summary>Có thể thêm bài học mới không?</summary>
              <p>Có. Dữ liệu bài học nằm trong <code>js/data.js</code>, <code>js/data2.js</code> và <code>js/data3.js</code>. Thêm một object bài học vào module là sidebar, tìm kiếm và tiến độ tự cập nhật.</p>
            </details>
            <details class="faq-item">
              <summary>Dùng trên điện thoại hoặc máy chiếu được không?</summary>
              <p>Được. Giao diện responsive, sidebar chuyển thành drawer và sơ đồ có thể cuộn ngang trên màn hình nhỏ. Trên máy chiếu, dùng nút toàn màn hình ở góc sơ đồ.</p>
            </details>
          </div>
        </section>

        <footer class="site-footer">
          <div class="footer-brand"><span>S</span> ScaleLab</div>
          <div class="footer-note">Một sản phẩm học tập gốc. Số liệu trong bài là ví dụ để minh họa, không phải benchmark.</div>
          <div class="footer-links">
            <a href="#/learn">Học</a>
            <a href="#/practice">Luyện tập</a>
            <a href="#/lab">Design Lab</a>
            <a href="#/cheatsheets">Cheatsheets</a>
          </div>
        </footer>
      </div>`;

    initReveals();
  }

  function heroVisual() {
    const nodes = [
      { x: 18, y: 168, w: 102, h: 54, label: "Client", sub: "browser", dot: "#7f9fff" },
      { x: 148, y: 168, w: 112, h: 54, label: "Balancer", sub: "traffic", dot: "#ff9a80", hot: true },
      { x: 296, y: 168, w: 108, h: 54, label: "App", sub: "logic", dot: "#7f9fff" },
      { x: 296, y: 66, w: 108, h: 50, label: "Cache", sub: "hot data", dot: "#ffd77a" },
      { x: 444, y: 168, w: 92, h: 54, label: "DB", sub: "truth", dot: "#6ee7c8" },
      { x: 296, y: 286, w: 108, h: 50, label: "Queue", sub: "async", dot: "#b49cff" },
      { x: 444, y: 286, w: 92, h: 50, label: "Worker", sub: "jobs", dot: "#ff9a80" }
    ];
    const paths = [
      { d: "M120 195 L148 195", dur: "2.2s" },
      { d: "M260 195 L296 195", dur: "2.5s" },
      { d: "M404 195 L444 195", dur: "2.8s" },
      { d: "M350 168 C350 144 350 134 350 116", dur: "2.1s" },
      { d: "M350 222 C350 252 350 264 350 286", dur: "2.9s" },
      { d: "M404 311 L444 311", dur: "2.4s" }
    ];
    return `
      <div class="hero-visual" aria-label="Minh họa một request đi qua các thành phần hệ thống">
        <div class="hv-bar">
          <span class="hv-dot"></span><span class="hv-dot"></span><span class="hv-dot"></span>
          <span class="hv-url">shop.example/checkout</span>
          <span class="hv-live"><span class="dot"></span>LIVE</span>
        </div>
        <svg class="hv-svg" viewBox="0 0 560 400" role="img">
          <defs>
            <pattern id="hvGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" fill="none" stroke="rgba(160,190,230,.09)" stroke-width=".8"/>
            </pattern>
            <linearGradient id="hvFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#0f1f33" stop-opacity=".2"/>
              <stop offset="1" stop-color="#0a1420" stop-opacity=".75"/>
            </linearGradient>
          </defs>
          <rect width="560" height="400" fill="url(#hvGrid)"/>
          <rect width="560" height="400" fill="url(#hvFade)"/>
          <text x="22" y="30" class="hv-grid-label">REQUEST PATH / BLUEPRINT 01</text>
          <text x="538" y="30" text-anchor="end" class="hv-grid-label">p95 180 ms</text>
          ${paths.map((p) => `<path class="hv-edge is-hot" d="${p.d}"/>`).join("")}
          ${paths.slice(0, 5).map((p, i) => `
            <circle class="hv-packet" r="3.2">
              <animateMotion dur="${p.dur}" repeatCount="indefinite" path="${p.d}" begin="-${(i * 0.45).toFixed(2)}s"/>
            </circle>`).join("")}
          ${nodes.map((n) => `
            <g class="hv-node${n.hot ? " is-hot" : ""}" transform="translate(${n.x},${n.y})">
              <rect class="hv-node-bg" width="${n.w}" height="${n.h}" rx="12"/>
              <circle cx="19" cy="${n.h / 2}" r="7" fill="none" stroke="${n.dot}" stroke-width="1.3" opacity=".9"/>
              <circle cx="19" cy="${n.h / 2}" r="2.5" fill="${n.dot}"/>
              <text x="34" y="${n.h / 2 - 2}" class="hv-node-label">${n.label}</text>
              <text x="34" y="${n.h / 2 + 11}" class="hv-node-sub">${n.sub}</text>
            </g>`).join("")}
          <text x="22" y="372" class="hv-grid-label">CACHE HIT 94% · 3 REPLICAS · QUEUE 120</text>
          <text x="538" y="372" text-anchor="end" class="hv-grid-label">LAT 20 + 30 + 8</text>
        </svg>
        <div class="hv-chip hv-chip-a"><b>p95 180 ms</b><span>trong ngân sách</span></div>
        <div class="hv-chip hv-chip-b"><b>Cache hit 94%</b><span>database nhẹ hơn</span></div>
        <div class="hv-chip hv-chip-c"><b>3 app replicas</b><span>scale ngang</span></div>
      </div>`;
  }

  function outlineModule(module) {
    const lessons = module.lessons.map((id) => lessonById[id]).filter(Boolean);
    return `
      <div class="outline-module" style="${toneVars(module.tone)}">
        <div class="outline-module-head">
          <span class="outline-module-num">${esc(module.num)}</span>
          <h3>${esc(module.title)}</h3>
          <span>${lessons.length} bài</span>
        </div>
        ${lessons.map((lesson) => {
          const idx = lessonList.indexOf(lesson) + 1;
          const done = isComplete(lesson.id);
          const step = savedStep(lesson.id);
          return `
            <a class="outline-lesson${done ? " is-done" : ""}" href="#/learn/${lesson.id}/${step}">
              <span class="outline-lesson-num">${idx < 10 ? "0" + idx : idx}</span>
              <span class="outline-lesson-title">${esc(lesson.title)}</span>
              <span class="outline-lesson-meta">${esc(lesson.duration)}</span>
              ${done ? '<span class="mini-check">✓</span>' : ""}
            </a>`;
        }).join("")}
      </div>`;
  }

  function labPromo() {
    const nodes = [
      { type: "client", label: "Client", sub: "12k rps" },
      { type: "lb", label: "Balancer", sub: "2 ms" },
      { type: "app", label: "App ×6", sub: "48k cap", hot: true },
      { type: "cache", label: "Cache", sub: "hit 80%", hot: true },
      { type: "db", label: "DB ×3", sub: "4.5k cap" }
    ];
    return `
      <div class="lab-promo">
        <div>
          <span class="eyebrow">Design Lab · mô phỏng trực tiếp</span>
          <h2>Tự tay ghép kiến trúc.<br>Nhìn nút thắt xuất hiện.</h2>
          <p>Thêm cache, load balancer, queue hoặc replica. Kéo traffic từ 300 lên 30.000 RPS và xem p95, chi phí, nút thắt cùng lời gợi ý thay đổi ngay lập tức.</p>
          <a class="btn btn-lime" href="#/lab">Mở Design Lab ${UI_ICONS.arrow}</a>
        </div>
        <div class="mini-pipe" aria-hidden="true">
          ${nodes.map((n, i) => `${i ? '<span class="mini-line"></span>' : ""}
            <div class="mini-node${n.hot ? " is-hot" : ""}">
              ${iconMarkup(n.type === "app" ? "server" : n.type === "db" ? "db" : n.type === "cache" ? "cache" : n.type === "lb" ? "lb" : "client")}
              <b>${n.label}</b>
              <span>${n.sub}</span>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function initReveals() {
    if (state.revealObserver) {
      state.revealObserver.disconnect();
      state.revealObserver = null;
    }
    const items = $$(".reveal");
    if (!items.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          state.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => state.revealObserver.observe(el));
  }

  function renderMissing() {
    document.title = "Không tìm thấy trang — ScaleLab";
    view.innerHTML = `
      <div class="missing">
        <span class="eyebrow">404</span>
        <h1>Trang này chưa có trong bản đồ</h1>
        <p>Đường dẫn không tồn tại hoặc bài học đã bị di chuyển. Quay về lộ trình để chọn một bài khác.</p>
        <a class="btn btn-primary" href="#/">Về trang chủ</a>
      </div>`;
  }

  /* ----------------------------------------------------------
     Global event wiring
     ---------------------------------------------------------- */
  function bindGlobalEvents() {
    window.addEventListener("hashchange", onRoute);
    window.addEventListener("resize", syncTopbarOffset);
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#searchBtn").addEventListener("click", openSearch);
    $("#menuBtn").addEventListener("click", toggleSidebar);
    $("#sidebarScrim").addEventListener("click", closeSidebar);
    $("#resetProgressBtn").addEventListener("click", () => {
      if (!window.confirm("Đặt lại toàn bộ tiến độ học trên trình duyệt này?")) return;
      state.progress = {};
      saveProgress();
      updateChrome();
      navigate("#/");
      toast("Đã đặt lại tiến độ.");
    });

    $$(".search-backdrop, [data-close-search]").forEach((el) => {
      el.addEventListener("click", closeSearch);
    });

    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSearchSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSearchSelection(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateSearchSelection();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    });
    searchResults.addEventListener("click", (e) => {
      if (e.target.closest(".search-result")) closeSearch();
    });

    document.addEventListener("keydown", (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (state.search.modalOpen) closeSearch();
        else openSearch();
        return;
      }
      if (e.key === "Escape") {
        if (state.search.modalOpen) {
          closeSearch();
          return;
        }
        if (document.body.classList.contains("sidebar-open")) {
          closeSidebar();
          return;
        }
      }
      if (state.route.view !== "learn" || state.search.modalOpen) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToStep(state.lesson.step + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToStep(state.lesson.step - 1);
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlayer();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        replayLesson();
      }
    });

    view.addEventListener("click", handleViewClick);
    view.addEventListener("input", handleViewInput);
    view.addEventListener("change", handleViewChange);
  }

  /* ----------------------------------------------------------
     Lesson engine
     ---------------------------------------------------------- */
  function renderLesson(lessonId, stepIndex) {
    const lesson = lessonById[lessonId];
    if (!lesson) {
      renderMissing();
      return;
    }
    const index = clamp(stepIndex || 1, 1, lesson.steps.length);
    state.lesson.id = lesson.id;
    state.lesson.step = index;
    state.lesson.playing = false;
    state.lesson.speed = 1;
    stopPlayer();
    try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }

    const mod = moduleMap[lesson.module];
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? "Bài tiếp" : "Luyện tập";
    document.title = `${lesson.title} — ScaleLab`;

    view.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-head">
          <div>
            <div class="lesson-breadcrumb">
              <a href="#/">ScaleLab</a><span class="sep">/</span>
              <span>${esc(mod.title)}</span><span class="sep">/</span>
              <span>${esc(lesson.shortTitle)}</span>
            </div>
            <h1 class="lesson-title">${esc(lesson.title)}</h1>
            <p class="lesson-sub">${esc(lesson.subtitle)}</p>
            <div class="lesson-badges">
              <span class="pill pill-blue">${esc(mod.num)} · ${esc(mod.title)}</span>
              <span class="pill">${esc(lesson.level)}</span>
              <span class="pill">${esc(lesson.duration)}</span>
              <span class="pill">${lesson.steps.length} bước</span>
            </div>
          </div>
          <div class="lesson-head-right">
            <a class="btn btn-ghost btn-sm" href="#/">Về lộ trình</a>
            <a class="btn btn-primary btn-sm" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
          </div>
        </div>

        <div class="lesson-layout">
          <div class="lesson-main">
            <div class="metric-strip" id="metricStrip">${metricStripHTML(lesson, lesson.steps[index - 1])}</div>

            <div class="stage-card" id="stageCard">
              <div class="stage-top">
                <div class="stage-title">
                  <span class="live-dot"></span>
                  <span>Sơ đồ sống</span>
                  <span>${lesson.nodes.length} nodes · ${lesson.edges.length} edges</span>
                </div>
                <div class="stage-actions">
                  <button class="stage-icon-btn" type="button" data-action="fullscreen" title="Xem toàn màn hình">
                    ${UI_ICONS.full}<span>Toàn màn hình</span>
                  </button>
                </div>
              </div>
              <div class="stage-canvas" id="stageCanvas">
                ${renderDiagram(lesson)}
              </div>
              <div class="stage-legend">
                <div class="legend">
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--blue)"></i>Request</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--mint)"></i>Dữ liệu / replicate</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--coral)"></i>Response / read</span>
                </div>
                <span class="stage-hint">← → chuyển bước · Space phát · R phát lại</span>
              </div>
            </div>

            <div class="player-card">
              <div class="player-top">
                <button class="play-btn" id="playBtn" type="button" data-action="toggle-play" aria-label="Phát tự động các bước">
                  ${UI_ICONS.play}
                </button>
                <button class="player-small-btn" type="button" data-action="replay" aria-label="Phát lại từ đầu" title="Phát lại">${UI_ICONS.replay}</button>
                <button class="player-small-btn" type="button" data-action="prev-step" aria-label="Bước trước">${UI_ICONS.prev}</button>
                <div class="player-track-wrap">
                  <div class="player-track"><div class="player-track-fill" id="playerFill"></div></div>
                  <div class="player-time">
                    <span id="playerStepText">Bước ${index}/${lesson.steps.length}</span>
                    <span id="playerPct">${Math.round((index / lesson.steps.length) * 100)}%</span>
                  </div>
                </div>
                <button class="player-small-btn" type="button" data-action="next-step" aria-label="Bước sau">${UI_ICONS.next}</button>
                <button class="speed-btn" type="button" data-action="cycle-speed" aria-label="Đổi tốc độ phát" title="Tốc độ phát">1×</button>
              </div>
              <div class="timeline" id="timeline">
                ${lesson.steps.map((step, i) => `
                  <button class="tl-step${i === index - 1 ? " is-active" : ""}${i < index - 1 ? " is-done" : ""}"
                          type="button" data-step="${i + 1}" title="Bước ${i + 1}: ${esc(step.title)}">
                    <span class="tl-step-bar"><span></span></span>
                    <span class="tl-step-label">${String(i + 1).padStart(2, "0")} · ${esc(step.short)}</span>
                  </button>`).join("")}
              </div>
            </div>
          </div>

          <aside class="step-panel" id="stepPanel">${stepPanelHTML(lesson, index)}</aside>
        </div>
      </div>`;

    state.lesson.step = index;
    applyStep(lesson, index, { updateHash: false, initial: true });
  }

  function metricStripHTML(lesson, step) {
    return lesson.metrics.map((m) => {
      const value = step.metrics && step.metrics[m.key] != null ? step.metrics[m.key] : "—";
      return `
        <div class="metric" style="--metric-color:var(--${m.tone})">
          <div class="metric-label">${esc(m.label)}</div>
          <div class="metric-value">${esc(value)}</div>
        </div>`;
    }).join("");
  }

  function stepPanelHTML(lesson, index) {
    const step = lesson.steps[index - 1];
    const isFirst = index === 1;
    const isLast = index === lesson.steps.length;
    const typeClass = step.tone === "warn" ? " type-warn" : step.tone === "final" ? " type-final" : "";
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? `Sang bài: ${next.title}` : "Luyện tập tình huống";
    const changes = step.changes && step.changes.length
      ? `<div class="step-section">
          <div class="step-section-title">Điều gì thay đổi</div>
          <div class="change-list">
            ${step.changes.map((c) => `<div class="change-item">${UI_ICONS.check}<span>${c}</span></div>`).join("")}
          </div>
        </div>`
      : "";
    const note = step.note
      ? `<div class="callout">
          <div class="callout-head">${iconMarkup("bulb")} Điểm cần nhớ</div>
          <p>${step.note}</p>
        </div>`
      : "";
    const complete = isLast
      ? `<div class="complete-banner">
          <h4>Bạn đã đi hết bài</h4>
          <p>Tiến độ đã được lưu trên trình duyệt. Có thể xem lại bất cứ lúc nào.</p>
          <a class="btn btn-sm btn-lime" style="margin-top:9px" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
        </div>`
      : "";

    return `
      <div class="step-panel-scroll">
        <div class="step-meta">
          <span class="step-counter">BƯỚC ${String(index).padStart(2, "0")} / ${String(lesson.steps.length).padStart(2, "0")}</span>
          <span class="step-type${typeClass}">${esc(step.type)}</span>
        </div>
        <h2 class="step-title">${esc(step.title)}</h2>
        <div class="step-body">${step.body}</div>
        ${note}
        ${changes}
        <div class="learn-box">
          <div class="step-section-title">Sau bài này, bạn nắm được</div>
          <div class="learn-list">
            ${lesson.learn.map((item) => `<div class="learn-item">${esc(item)}</div>`).join("")}
          </div>
        </div>
        ${complete}
      </div>
      <div class="step-nav">
        <button class="btn btn-ghost" type="button" data-action="prev-step" ${isFirst ? "disabled" : ""}>${UI_ICONS.prev} Trước</button>
        <button class="btn btn-primary" type="button" data-action="next-step" ${isLast ? "disabled" : ""}>Tiếp ${UI_ICONS.next}</button>
      </div>
      <div class="kbd-hints">
        <span><kbd>←</kbd><kbd>→</kbd> chuyển bước</span>
        <span><kbd>Space</kbd> phát</span>
        <span><kbd>R</kbd> lại</span>
      </div>`;
  }

  function anchorPoint(node, dx, dy) {
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { x: dx >= 0 ? node.x + node.w : node.x, y: cy };
    }
    return { x: cx, y: dy >= 0 ? node.y + node.h : node.y };
  }

  function edgeGeometry(edge, nodeById) {
    const a = nodeById[edge.from];
    const b = nodeById[edge.to];
    if (!a || !b) return null;
    const acx = a.x + a.w / 2;
    const acy = a.y + a.h / 2;
    const bcx = b.x + b.w / 2;
    const bcy = b.y + b.h / 2;
    const p1 = anchorPoint(a, bcx - acx, bcy - acy);
    const p2 = anchorPoint(b, acx - bcx, acy - bcy);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    let path = "";
    let mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    if (edge.bow) {
      const nx = -dy / len;
      const ny = dx / len;
      const cx = mid.x + nx * edge.bow;
      const cy = mid.y + ny * edge.bow;
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      mid = {
        x: 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x,
        y: 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y
      };
    } else {
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const labelPos = {
      x: mid.x + (horizontal ? 0 : 10),
      y: mid.y + (horizontal ? -8 : 0)
    };
    return { path, labelPos, p1, p2 };
  }

  function renderDiagram(lesson) {
    const nodeById = {};
    lesson.nodes.forEach((n) => { nodeById[n.id] = n; });
    const types = Array.from(new Set(lesson.nodes.map((n) => n.type)));
    const symbols = types.map((type) => `
      <symbol id="i-${type}" viewBox="0 0 20 20">
        <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          ${ICON_PATHS[type] || ICON_PATHS.server}
        </g>
      </symbol>`).join("");
    const paths = {};

    const edgeMarkup = lesson.edges.map((edge) => {
      const geo = edgeGeometry(edge, nodeById);
      if (!geo) return "";
      paths[edge.id] = geo.path;
      const label = edge.label
        ? (() => {
            const width = Math.max(28, edge.label.length * 4.9 + 9);
            const x = geo.labelPos.x - width / 2;
            const y = geo.labelPos.y - 9;
            return `
              <g class="d-edge-label-g">
                <rect class="d-edge-label-bg" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="13" rx="3.5"/>
                <text class="d-edge-label" x="${geo.labelPos.x.toFixed(1)}" y="${(geo.labelPos.y + 1.5).toFixed(1)}" text-anchor="middle">${esc(edge.label)}</text>
              </g>`;
          })()
        : "";
      const kindClass = edge.kind === "response" ? " is-response" : edge.kind === "data" ? " is-data" : "";
      return `<g data-edge-group="${edge.id}"><path class="d-edge${kindClass}" data-edge="${edge.id}" d="${geo.path}" marker-end="url(#d-arrow)"/>${label}</g>`;
    }).join("");

    const nodeMarkup = lesson.nodes.map((node) => {
      const tone = nodeToneVars(node.type);
      const iy = (node.h - 32) / 2;
      return `
        <g class="d-node" data-node="${node.id}" transform="translate(${node.x},${node.y})" style="${tone}">
          <title>${esc(node.label)} — ${esc(node.sub)}</title>
          <rect class="node-bg" width="${node.w}" height="${node.h}" rx="12"/>
          <rect class="node-accent" x="0" y="12" width="3" height="${node.h - 24}" rx="1.5"/>
          <rect class="node-icon-wrap" x="12" y="${iy.toFixed(1)}" width="32" height="32" rx="9"/>
          <use class="node-icon" href="#i-${node.type}" x="20" y="${(iy + 8).toFixed(1)}" width="16" height="16"/>
          <text class="node-label" x="54" y="${(node.h / 2 - 3).toFixed(1)}">${esc(node.label)}</text>
          <text class="node-sub" x="54" y="${(node.h / 2 + 11).toFixed(1)}">${esc(node.sub)}</text>
        </g>`;
    }).join("");

    state.diagram = { paths, nodeById };

    return `
      <svg class="diagram" viewBox="0 0 900 500" role="img" aria-label="Sơ đồ hệ thống cho bài ${esc(lesson.title)}">
        <title>${esc(lesson.title)} — sơ đồ tương tác</title>
        <desc>Các thành phần hệ thống và luồng request được làm nổi bật theo từng bước.</desc>
        <defs>
          ${symbols}
          <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#2f6bff" flood-opacity=".32"/>
          </filter>
          <marker id="d-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--diagram-edge)"/>
          </marker>
          <marker id="d-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--blue)"/>
          </marker>
        </defs>
        <g class="d-edges">${edgeMarkup}</g>
        <g class="d-nodes">${nodeMarkup}</g>
        <g id="packetLayer"></g>
      </svg>`;
  }

  function renderPackets(edgeIds) {
    const layer = $("#packetLayer");
    if (!layer || !state.diagram) return;
    layer.textContent = "";
    const ids = edgeIds.slice(0, 12);
    ids.forEach((id, i) => {
      const path = state.diagram.paths[id];
      if (!path) return;
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("r", "3.4");
      circle.setAttribute("class", "d-packet");
      const anim = document.createElementNS(SVGNS, "animateMotion");
      anim.setAttribute("dur", `${(1.5 + (i % 4) * 0.28).toFixed(2)}s`);
      anim.setAttribute("repeatCount", "indefinite");
      anim.setAttribute("path", path);
      anim.setAttribute("begin", `-${(i * 0.33).toFixed(2)}s`);
      anim.setAttribute("calcMode", "spline");
      anim.setAttribute("keySplines", "0.4 0 0.2 1");
      anim.setAttribute("keyTimes", "0;1");
      circle.appendChild(anim);
      layer.appendChild(circle);
    });
  }

  function applyStep(lesson, index, opts) {
    const step = lesson.steps[index - 1];
    if (!step) return;
    const options = opts || {};
    const focus = step.focus === "all" ? lesson.nodes.map((n) => n.id) : (step.focus || []);
    const activeEdges = step.edges === "all" ? lesson.edges.map((e) => e.id) : (step.edges || []);
    const warn = step.warn || [];

    $$(".d-node", view).forEach((el) => {
      const id = el.dataset.node;
      const active = focus.includes(id);
      const isWarn = warn.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-warn", isWarn);
      el.classList.toggle("is-dim", !active && !isWarn && focus.length > 0);
    });

    $$(".d-edge", view).forEach((el) => {
      const id = el.dataset.edge;
      const active = activeEdges.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-dim", activeEdges.length > 0 && !active);
      el.setAttribute("marker-end", active ? "url(#d-arrow-active)" : "url(#d-arrow)");
    });

    renderPackets(activeEdges);

    const panel = $("#stepPanel");
    if (panel) {
      panel.innerHTML = stepPanelHTML(lesson, index);
      const scroll = $(".step-panel-scroll", panel);
      if (scroll) scroll.scrollTop = 0;
    }

    const strip = $("#metricStrip");
    if (strip) {
      strip.innerHTML = metricStripHTML(lesson, step);
      $$(".metric", strip).forEach((el) => {
        el.classList.add("is-pulse");
        setTimeout(() => el.classList.remove("is-pulse"), 650);
      });
    }

    $$(".tl-step", view).forEach((el, i) => {
      el.classList.toggle("is-active", i === index - 1);
      el.classList.toggle("is-done", i < index - 1);
    });

    state.lesson.step = index;
    state.lesson.id = lesson.id;
    updatePlayerUI(lesson, index);

    if (state.diagram && options.updateHash !== false) {
      try { history.replaceState(null, "", `#/learn/${lesson.id}/${index}`); } catch (err) { /* ignore */ }
    }
    if (!options.initial) {
      try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }
    }

    const previous = state.progress[lesson.id] || 0;
    if (index > previous) {
      state.progress[lesson.id] = index;
      saveProgress();
      updateChrome();
    }

    if (state.lesson.playing && index >= lesson.steps.length) {
      stopPlayer();
    }
  }

  function updatePlayerUI(lesson, index) {
    const fill = $("#playerFill");
    if (fill) fill.style.width = `${(index / lesson.steps.length) * 100}%`;
    const stepText = $("#playerStepText");
    if (stepText) stepText.textContent = `Bước ${index}/${lesson.steps.length}`;
    const pct = $("#playerPct");
    if (pct) pct.textContent = `${Math.round((index / lesson.steps.length) * 100)}%`;
    const playBtn = $("#playBtn");
    if (playBtn) {
      playBtn.innerHTML = state.lesson.playing ? UI_ICONS.pause : UI_ICONS.play;
      playBtn.setAttribute("aria-label", state.lesson.playing ? "Tạm dừng phát tự động" : "Phát tự động các bước");
    }
    const speedBtn = $(".speed-btn", view);
    if (speedBtn) speedBtn.textContent = `${state.lesson.speed}×`;
  }

  function goToStep(index) {
    if (!state.lesson.id) return false;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return false;
    const target = clamp(index, 1, lesson.steps.length);
    applyStep(lesson, target, { updateHash: true });
    if (state.lesson.playing) {
      if (target >= lesson.steps.length) {
        stopPlayer();
      } else {
        restartAutoTimer();
      }
    }
    return true;
  }

  function restartAutoTimer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    if (!state.lesson.playing) return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.timer = setInterval(() => {
      if (!state.lesson.playing) return;
      const current = state.lesson.step;
      if (current < lesson.steps.length) {
        goToStep(current + 1);
      } else {
        stopPlayer();
      }
    }, AUTO_MS / state.lesson.speed);
  }

  function setPlaying(playing) {
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    if (playing && state.lesson.step >= lesson.steps.length) {
      applyStep(lesson, 1, { updateHash: true });
    }
    state.lesson.playing = Boolean(playing);
    if (state.lesson.playing) restartAutoTimer();
    else {
      clearInterval(state.lesson.timer);
      state.lesson.timer = null;
    }
    updatePlayerUI(lesson, state.lesson.step);
  }

  function togglePlayer() {
    if (state.route.view !== "learn") return;
    setPlaying(!state.lesson.playing);
  }

  function stopPlayer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    state.lesson.playing = false;
    const lesson = lessonById[state.lesson.id];
    if (lesson && state.route.view === "learn" && $("#playBtn")) {
      updatePlayerUI(lesson, state.lesson.step);
    }
  }

  function replayLesson() {
    if (state.route.view !== "learn") return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.playing = false;
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    applyStep(lesson, 1, { updateHash: true });
    setPlaying(true);
  }

  function cycleSpeed() {
    const speeds = [1, 1.5, 2];
    const idx = speeds.indexOf(state.lesson.speed);
    state.lesson.speed = speeds[(idx + 1) % speeds.length];
    const lesson = lessonById[state.lesson.id];
    if (lesson) updatePlayerUI(lesson, state.lesson.step);
    if (state.lesson.playing) restartAutoTimer();
  }

  function toggleFullscreen() {
    const card = $("#stageCard");
    if (!card) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (card.requestFullscreen) {
      card.requestFullscreen().catch(() => toast("Trình duyệt không cho phép toàn màn hình ở chế độ này."));
    } else {
      toast("Trình duyệt không hỗ trợ toàn màn hình.");
    }
  }

  /* ----------------------------------------------------------
     Practice engine
     ---------------------------------------------------------- */
  const PRACTICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

  function initPractice() {
    const order = SL.practice.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    state.practice = { order, index: 0, selected: null, answered: false, results: [] };
  }

  function renderPractice() {
    if (!state.practice) initPractice();
    document.title = "Luyện tập — ScaleLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Luyện tập</div>
            <h1>Tình huống thực tế</h1>
            <p>${SL.practice.length} tình huống thực tế về nút thắt, Git và CI/CD. Chọn thay đổi có tác động lớn nhất trước khi xem lời giải thích.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-primary" href="#/learn">Vào bài học</a>
          </div>
        </div>
        <div class="practice-layout">
          <div id="practiceCard"></div>
          <aside class="practice-side" id="practiceSide"></aside>
        </div>
      </div>`;
    renderPracticeCard();
    renderPracticeSide();
  }

  function renderPracticeCard() {
    const wrap = $("#practiceCard");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    if (p.index >= total) {
      const correct = p.results.filter(Boolean).length;
      const pct = Math.round((correct / total) * 100);
      const message = pct >= 80
        ? "Bạn đọc tình huống rất tốt. Thử Design Lab hoặc mở lại bài tương ứng để đào sâu."
        : pct >= 50
          ? "Nền tảng đã vững. Xem lại các tình huống sai và chú ý chỉ số nào đang báo đỏ."
          : "Hãy mở lại các bài liên quan tới tình huống sai, rồi thử lại lượt luyện này.";
      wrap.innerHTML = `
        <div class="scenario-card practice-result">
          <div class="result-ring" style="--score:${pct}"><b>${pct}%</b></div>
          <h2>Hoàn thành lượt luyện</h2>
          <p>Bạn trả lời đúng <strong>${correct}/${total}</strong> tình huống. ${message}</p>
          <div class="result-actions">
            <button class="btn btn-primary" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-ghost" href="#/lab">Mở Design Lab</a>
          </div>
        </div>`;
      return;
    }

    const q = SL.practice[p.order[p.index]];
    const feedback = p.answered
      ? (() => {
          const correct = p.selected === q.correct;
          const isLast = p.index === total - 1;
          return `
            <div class="feedback ${correct ? "is-good" : "is-bad"}" id="practiceFeedback" tabindex="-1">
              <div class="feedback-head">${correct ? UI_ICONS.check : iconMarkup("info")} ${correct ? "Chính xác" : "Chưa đúng"}</div>
              <p>${q.explain}</p>
              <div class="feedback-actions">
                <button class="btn btn-primary btn-sm" type="button" data-action="next-question">
                  ${isLast ? "Xem kết quả" : `Tình huống tiếp ${UI_ICONS.arrow}`}
                </button>
              </div>
            </div>`;
        })()
      : "";

    wrap.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-top">
          <span class="scenario-num">TÌNH HUỐNG ${String(p.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
          <span class="pill pill-blue">${esc(q.tag)}</span>
        </div>
        <div class="scenario-body">
          <h2>${esc(q.title)}</h2>
          <p class="scenario-text">${esc(q.scenario)}</p>
          <div class="metric-chips">
            ${q.metrics.map((m) => `<div class="metric-chip${m.danger ? " danger" : ""}"><span>${esc(m.label)}</span><b>${esc(m.value)}</b></div>`).join("")}
          </div>
          <div class="options">
            ${q.options.map((option, i) => {
              let cls = "";
              if (p.answered) {
                if (i === q.correct) cls = " is-correct";
                else if (i === p.selected) cls = " is-wrong";
              }
              return `
                <button class="option-btn${cls}" type="button" data-action="answer" data-option="${i}" ${p.answered ? "disabled" : ""}>
                  <span class="option-letter">${PRACTICE_LETTERS[i]}</span>
                  <span>${esc(option)}</span>
                </button>`;
            }).join("")}
          </div>
          ${feedback}
        </div>
      </div>`;
    if (p.answered) {
      const f = $("#practiceFeedback");
      if (f) f.focus({ preventScroll: true });
    }
  }

  function renderPracticeSide() {
    const wrap = $("#practiceSide");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    const correct = p.results.filter(Boolean).length;
    const answeredCount = p.results.filter((v) => v !== undefined).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const current = Math.min(p.index, total - 1);
    wrap.innerHTML = `
      <div class="side-card">
        <h3>Điểm của bạn</h3>
        <div class="score-big">${correct}<small> / ${total}</small></div>
        <div class="score-bar"><span style="width:${pct}%"></span></div>
        <p class="score-note">${answeredCount} tình huống đã trả lời · ${pct}% chính xác</p>
      </div>
      <div class="side-card">
        <h3>Tiến độ lượt luyện</h3>
        <div class="practice-progress">
          ${p.order.map((_, i) => {
            const done = i < p.results.length;
            const isCurrent = i === current && p.index < total;
            return `<span class="pp-dot${done ? " is-done" : ""}${isCurrent ? " is-current" : ""}" title="Tình huống ${i + 1}"></span>`;
          }).join("")}
        </div>
        <p class="score-note">Mỗi câu chỉ có một lựa chọn tối ưu theo bối cảnh.</p>
      </div>
      <div class="side-card">
        <h3>Cách luyện hiệu quả</h3>
        <p class="score-note">Đọc chỉ số báo đỏ trước, xác định nút thắt, rồi mới chọn giải pháp. Đừng chọn công cụ chỉ vì nó nghe hiện đại.</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:11px" href="#/cheatsheets/patterns">Mở bảng mẫu &amp; giao tiếp</a>
      </div>`;
  }

  function answerPractice(option) {
    const p = state.practice;
    if (!p || p.answered || p.index >= p.order.length) return;
    const q = SL.practice[p.order[p.index]];
    if (option < 0 || option >= q.options.length) return;
    p.selected = option;
    p.answered = true;
    p.results[p.index] = option === q.correct;
    renderPracticeCard();
    renderPracticeSide();
  }

  function nextPracticeQuestion() {
    const p = state.practice;
    if (!p || !p.answered) return;
    if (p.index < p.order.length - 1) {
      p.index += 1;
      p.selected = null;
      p.answered = false;
    } else {
      p.index = p.order.length;
    }
    renderPracticeCard();
    renderPracticeSide();
    const card = $(".scenario-card", view);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restartPractice() {
    initPractice();
    renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Đã bắt đầu lượt luyện mới.");
  }

  /* ----------------------------------------------------------
     Design Lab
     ---------------------------------------------------------- */
  function initLab() {
    if (state.lab) return;
    applyLabPreset("sale");
  }

  function applyLabPreset(id) {
    const preset = SL.lab.presets.find((p) => p.id === id) || SL.lab.presets[0];
    const replicas = {};
    Object.keys(SL.lab.components).forEach((key) => {
      if (SL.lab.components[key].replicas) replicas[key] = 1;
    });
    Object.keys(preset.replicas || {}).forEach((key) => {
      const comp = SL.lab.components[key];
      if (comp && comp.replicas) replicas[key] = clamp(preset.replicas[key], 1, comp.maxReplicas || 8);
    });
    state.lab = {
      preset: preset.id,
      pipeline: preset.pipeline.slice(),
      rps: preset.rps,
      cacheHit: preset.cacheHit,
      replicas,
      running: true
    };
  }

  function computeLab() {
    const components = SL.lab.components;
    const lab = state.lab;
    const pipeline = lab ? lab.pipeline.filter((key) => components[key]) : [];
    if (!pipeline.length) {
      return { stages: [], maxUtil: 0, bottleneckKey: null, bottleneck: null, p95: 0, cost: 0, failure: 0, hasCache: false };
    }
    const hasCache = pipeline.includes("cache");
    const cacheHit = hasCache ? clamp(lab.cacheHit, 0, 100) : 0;
    const rps = Math.max(0, lab.rps);
    const stages = pipeline.map((key) => {
      const comp = components[key];
      const replicas = comp.replicas ? Math.max(1, lab.replicas[key] || 1) : 1;
      const capacity = comp.capacity * replicas;
      const load = key === "db" && hasCache ? rps * (1 - cacheHit / 100) : rps;
      const util = capacity > 0 ? (load / capacity) * 100 : 0;
      const queuePenalty = Math.max(0, util - 60) / 40;
      const latency = comp.latency * (1 + queuePenalty * queuePenalty * 1.8) + (util > 100 ? (util - 100) * 0.3 : 0);
      const missWeight = key === "db" && hasCache ? 1 - cacheHit / 100 : 1;
      return {
        key,
        comp,
        replicas,
        capacity,
        load,
        util,
        latency,
        weightedLatency: latency * missWeight
      };
    });
    const maxStage = stages.reduce((a, b) => (b.util > a.util ? b : a), stages[0]);
    const totalLatency = stages.reduce((sum, s) => sum + s.weightedLatency, 0);
    const p95 = totalLatency * (1.35 + Math.max(0, maxStage.util - 60) / 45);
    const cost = stages.reduce((sum, s) => sum + s.comp.cost * s.replicas, 0);
    const failure = stages.reduce((max, s) => {
      if (s.load <= s.capacity) return max;
      return Math.max(max, ((s.load - s.capacity) / s.load) * 100);
    }, 0);
    return {
      stages,
      maxUtil: maxStage.util,
      bottleneckKey: maxStage.key,
      bottleneck: maxStage,
      p95,
      cost,
      failure,
      hasCache
    };
  }

  function labStageHTML(stage, result, isBottleneck) {
    const el = stage;
    const util = Math.round(el.util);
    const isWarning = el.util > 85 && el.util <= 100;
    const cls = isBottleneck ? " is-bottleneck" : isWarning ? " is-warning" : "";
    const capLabel = el.comp.capacity >= 999999 ? "∞" : formatInt(el.capacity);
    return `
      <div class="lab-node${cls}" data-lab-node="${el.key}" style="--tone:var(--${el.comp.tone});--tone-soft:var(--${el.comp.tone}-soft)" title="${esc(el.comp.label)}: ${formatInt(el.load)} / ${formatInt(el.capacity)} RPS">
        ${isBottleneck ? `<span class="lab-node-bottleneck-tag">NÚT THẮT</span>` : ""}
        <div class="lab-node-top">
          <span class="lab-node-icon">${iconMarkup(el.comp.type)}</span>
          <div>
            <div class="lab-node-name">${esc(el.comp.label)}</div>
            <div class="lab-node-type">${esc(el.key)}${el.replicas > 1 ? ` ×${el.replicas}` : ""}</div>
          </div>
        </div>
        <div class="lab-node-stats">
          <div>Load<b>${formatInt(el.load)}</b></div>
          <div>Cap<b>${capLabel}</b></div>
          <div>Util<b>${util}%</b></div>
        </div>
        <div class="lab-node-bar"><span style="width:${clamp(el.util, 0, 100)}%"></span></div>
        <div class="lab-node-actions">
          <button class="lab-mini-btn" type="button" data-action="lab-move" data-key="${el.key}" data-dir="-1" title="Chuyển sang trái" aria-label="Chuyển ${esc(el.comp.label)} sang trái">${UI_ICONS.prev}</button>
          <button class="lab-mini-btn" type="button" data-action="lab-move" data-key="${el.key}" data-dir="1" title="Chuyển sang phải" aria-label="Chuyển ${esc(el.comp.label)} sang phải">${UI_ICONS.next}</button>
          <button class="lab-mini-btn" type="button" data-action="lab-remove" data-key="${el.key}" title="Xóa khỏi pipeline" aria-label="Xóa ${esc(el.comp.label)}">${UI_ICONS.trash}</button>
          ${el.comp.replicas ? `
            <span class="lab-replica">
              <button class="lab-mini-btn" type="button" data-action="lab-rep" data-key="${el.key}" data-delta="-1" aria-label="Giảm bản sao">${UI_ICONS.minus}</button>
              <b>${el.replicas}</b>
              <button class="lab-mini-btn" type="button" data-action="lab-rep" data-key="${el.key}" data-delta="1" aria-label="Tăng bản sao">${UI_ICONS.plus}</button>
            </span>` : ""}
        </div>
      </div>`;
  }

  function labPipelineHTML(result) {
    if (!state.lab.pipeline.length) {
      return `<div class="no-results" style="min-width:280px">Pipeline đang trống. Thêm thành phần từ bảng phía dưới.</div>`;
    }
    const stageByKey = {};
    result.stages.forEach((s) => { stageByKey[s.key] = s; });
    return state.lab.pipeline.map((key, i) => {
      const stage = stageByKey[key];
      if (!stage) return "";
      const isBottleneck = key === result.bottleneckKey && result.maxUtil >= 99;
      return `${i > 0 ? '<div class="lab-connector"></div>' : ""}${labStageHTML(stage, result, isBottleneck)}`;
    }).join("");
  }

  function labMetricsHTML(result) {
    const p95 = Math.round(result.p95);
    return `
      <div class="lab-metric"><span>Traffic</span><b>${formatInt(state.lab.rps)} RPS</b></div>
      <div class="lab-metric${p95 > 500 ? " danger" : p95 < 120 ? " good" : ""}"><span>p95 dự báo</span><b>${formatInt(p95)} ms</b></div>
      <div class="lab-metric"><span>Chi phí / tháng</span><b>$${formatInt(result.cost)}</b></div>
      <div class="lab-metric${result.failure > 0.5 ? " danger" : " good"}"><span>Ước tính lỗi</span><b>${result.failure.toFixed(1)}%</b></div>`;
  }

  function labStatusHTML(result) {
    if (!result.stages.length) {
      return `<div class="lab-status warning"><span class="dot"></span><span>Chưa có thành phần trong pipeline</span></div>`;
    }
    if (result.maxUtil >= 99) {
      const label = SL.lab.components[result.bottleneckKey].label;
      return `<div class="lab-status bottleneck"><span class="dot"></span><span>Nút thắt: ${esc(label)} · ${Math.round(result.maxUtil)}% tải</span></div>`;
    }
    if (result.maxUtil > 85) {
      const label = SL.lab.components[result.bottleneckKey].label;
      return `<div class="lab-status warning"><span class="dot"></span><span>Cảnh báo: ${esc(label)} đã ở ${Math.round(result.maxUtil)}%</span></div>`;
    }
    return `<div class="lab-status healthy"><span class="dot"></span><span>Ổn định · đỉnh tải ${Math.round(result.maxUtil)}%</span></div>`;
  }

  function labSuggestions(result) {
    const list = [];
    if (!result.stages.length) {
      return `<div class="suggestion-item">${iconMarkup("bulb")}<span>Bắt đầu bằng <b>App server</b> và <b>Database</b>, sau đó thêm load balancer hoặc cache khi tải tăng.</span></div>`;
    }
    const hasCache = state.lab.pipeline.includes("cache");
    const hasQueue = state.lab.pipeline.includes("queue");
    const comp = result.bottleneck ? result.bottleneck.comp : null;
    if (result.maxUtil >= 99 && result.bottleneck) {
      const stage = result.bottleneck;
      if (stage.comp.replicas && stage.replicas < (stage.comp.maxReplicas || 8)) {
        list.push(`<b>${esc(stage.comp.label)}</b> vượt ${Math.round(stage.util)}% công suất. Tăng lên ${stage.replicas + 1} bản sao để có thêm năng lực.`);
      } else if (stage.key === "db" && !hasCache) {
        list.push("Database đang chịu toàn bộ traffic đọc. Thêm cache cho các truy vấn nóng trước khi shard.");
      } else if (stage.key === "db" && hasCache) {
        list.push(`Cache đang hấp thụ ${state.lab.cacheHit}% lượt đọc. Tăng hit rate hoặc thêm read replica cho database.`);
      } else {
        list.push(`Giảm tải cho <b>${esc(stage.comp.label)}</b> hoặc thêm một tầng song song phía trước.`);
      }
    }
    if (hasCache && state.lab.cacheHit < 80 && state.lab.rps > 3000) {
      list.push("Cache hit đang thấp. Kiểm tra TTL, kích thước cache và mẫu truy cập trước khi mua thêm server.");
    }
    if (!hasQueue && state.lab.rps > 5000 && state.lab.pipeline.includes("db")) {
      list.push("Việc ghi/analytics có thể đưa vào message queue để không chặn đường đọc chính.");
    }
    if (result.p95 > 500) {
      list.push("p95 đang cao. Tìm thành phần có util cao nhất thay vì tối ưu những chỗ không nằm trên đường tới hạn.");
    }
    if (!list.length) {
      list.push("Cấu hình đang khỏe. Tăng traffic hoặc thêm CDN/queue để thử giới hạn tiếp theo.");
    }
    return list.slice(0, 3).map((text) => `<div class="suggestion-item">${iconMarkup("bulb")}<span>${text}</span></div>`).join("");
  }

  function labLiveHTML() {
    return `<span class="lab-live${state.lab.running ? " is-on" : ""}"><span class="dot"></span>${state.lab.running ? "ĐANG MÔ PHỎNG" : "TẠM DỪNG"}</span>`;
  }

  function renderLab() {
    initLab();
    const result = computeLab();
    document.title = "Design Lab — ScaleLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Design Lab</div>
            <h1>Vẽ hệ thống, thấy nút thắt</h1>
            <p>Thêm thành phần, kéo traffic và quan sát latency, chi phí, tỉ lệ lỗi thay đổi theo thời gian thực.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="lab-reset">Về mặc định</button>
            <a class="btn btn-primary" href="#/learn">Học lý thuyết</a>
          </div>
        </div>
        <div class="lab-toolbar">
          <div class="preset-row">
            ${SL.lab.presets.map((p) => `<button class="preset-btn${state.lab.preset === p.id ? " is-active" : ""}" type="button" data-action="lab-preset" data-preset="${p.id}">${esc(p.name)}</button>`).join("")}
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="lab-note">Mô hình rút gọn · 1 RPS = 1 request</span>
            <button class="btn btn-ghost btn-sm" type="button" data-action="toggle-lab-run">${state.lab.running ? "Tạm dừng" : "Chạy mô phỏng"}</button>
          </div>
        </div>
        <div class="lab-layout">
          <div class="lab-main">
            <div class="lab-stage${state.lab.running ? "" : " lab-paused"}" id="labStage">
              <div class="lab-stage-head">
                <div>
                  <h2>Pipeline hiện tại</h2>
                  <p>${state.lab.pipeline.length} thành phần · ${formatInt(state.lab.rps)} RPS · cache hit ${state.lab.cacheHit}%</p>
                </div>
                ${labLiveHTML()}
              </div>
              <div class="pipeline-viewport">
                <div class="pipeline-track" id="pipelineTrack">${labPipelineHTML(result)}</div>
                <div class="lab-packet"></div><div class="lab-packet"></div><div class="lab-packet"></div>
              </div>
            </div>
            <div class="palette">
              <div class="palette-head"><h3>Thêm thành phần</h3><span>Mỗi thành phần xuất hiện một lần; app/db/worker có thể nhân bản</span></div>
              <div class="palette-row">
                ${Object.entries(SL.lab.components).filter(([key]) => key !== "client").map(([key, comp]) => {
                  const present = state.lab.pipeline.includes(key);
                  return `<button class="palette-btn" type="button" data-action="lab-add" data-key="${key}" style="--tone:var(--${comp.tone})" ${present ? "disabled" : ""} title="${present ? "Đã có trong pipeline" : `Thêm ${esc(comp.label)}`}">${iconMarkup(comp.type)} ${esc(comp.label)}</button>`;
                }).join("")}
              </div>
            </div>
          </div>
          <aside class="lab-side">
            <div class="lab-controls">
              <h3>Tham số tải</h3>
              <div class="control-row">
                <div class="control-label"><span>Traffic</span><b id="labRpsVal">${formatInt(state.lab.rps)} RPS</b></div>
                <input type="range" min="100" max="30000" step="100" value="${state.lab.rps}" data-lab-range="rps" aria-label="Traffic mỗi giây">
              </div>
              <div class="control-row">
                <div class="control-label"><span>Cache hit</span><b id="labCacheVal">${state.lab.cacheHit}%</b></div>
                <input type="range" min="0" max="95" step="1" value="${state.lab.cacheHit}" data-lab-range="cacheHit" aria-label="Tỉ lệ cache hit" ${state.lab.pipeline.includes("cache") ? "" : "disabled"}>
                ${state.lab.pipeline.includes("cache") ? "" : '<p class="lab-note" style="margin-top:6px">Thêm cache để tham số này có tác dụng.</p>'}
              </div>
            </div>
            <div class="lab-controls">
              <h3>Chỉ số dự báo</h3>
              <div class="lab-metrics" id="labMetrics">${labMetricsHTML(result)}</div>
              <div id="labStatusWrap">${labStatusHTML(result)}</div>
            </div>
            <div class="suggestions">
              <h3>Gợi ý tiếp theo</h3>
              <div class="suggestion-list" id="suggestionList">${labSuggestions(result)}</div>
              <p class="lab-note" style="margin-top:10px">Mô hình đơn giản hoá: replica nhân năng lực đọc, cache làm giảm tải database. Số liệu thật còn phụ thuộc hàng đợi, phân bố dữ liệu và mạng.</p>
            </div>
          </aside>
        </div>
      </div>`;
  }

  function updateLab() {
    if (!state.lab) return;
    const result = computeLab();
    const track = $("#pipelineTrack");
    if (track) track.innerHTML = labPipelineHTML(result);
    const metrics = $("#labMetrics");
    if (metrics) metrics.innerHTML = labMetricsHTML(result);
    const status = $("#labStatusWrap");
    if (status) status.innerHTML = labStatusHTML(result);
    const suggestions = $("#suggestionList");
    if (suggestions) suggestions.innerHTML = labSuggestions(result);
    const stageHead = $(".lab-stage-head p", view);
    if (stageHead) stageHead.textContent = `${state.lab.pipeline.length} thành phần · ${formatInt(state.lab.rps)} RPS · cache hit ${state.lab.cacheHit}%`;
    $$(".preset-btn", view).forEach((b) => b.classList.toggle("is-active", b.dataset.preset === state.lab.preset));
  }

  function addLabComponent(key) {
    if (!state.lab || !SL.lab.components[key] || state.lab.pipeline.includes(key)) return;
    const pipeline = state.lab.pipeline;
    let index = pipeline.length;
    if (key === "cache") {
      const dbIndex = pipeline.indexOf("db");
      if (dbIndex >= 0) index = dbIndex;
    } else if (key === "queue") {
      const workerIndex = pipeline.indexOf("worker");
      const dbIndex = pipeline.indexOf("db");
      if (workerIndex >= 0) index = workerIndex;
      else if (dbIndex >= 0) index = dbIndex;
    } else if (key === "worker") {
      const dbIndex = pipeline.indexOf("db");
      if (dbIndex >= 0) index = dbIndex;
    }
    pipeline.splice(index, 0, key);
    if (SL.lab.components[key].replicas && !state.lab.replicas[key]) state.lab.replicas[key] = 1;
    state.lab.preset = null;
    renderLab();
  }

  function removeLabComponent(key) {
    if (!state.lab) return;
    state.lab.pipeline = state.lab.pipeline.filter((k) => k !== key);
    state.lab.preset = null;
    renderLab();
  }

  function moveLabComponent(key, dir) {
    if (!state.lab) return;
    const pipeline = state.lab.pipeline;
    const i = pipeline.indexOf(key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= pipeline.length) return;
    [pipeline[i], pipeline[j]] = [pipeline[j], pipeline[i]];
    state.lab.preset = null;
    renderLab();
  }

  function changeLabReplicas(key, delta) {
    if (!state.lab) return;
    const comp = SL.lab.components[key];
    if (!comp || !comp.replicas) return;
    const current = state.lab.replicas[key] || 1;
    state.lab.replicas[key] = clamp(current + delta, 1, comp.maxReplicas || 8);
    state.lab.preset = null;
    renderLab();
  }

  function toggleLabRun() {
    if (!state.lab) return;
    state.lab.running = !state.lab.running;
    renderLab();
  }

  /* ----------------------------------------------------------
     Cheatsheets
     ---------------------------------------------------------- */
  function renderCheatsheets() {
    const sections = SL.cheatsheets;
    const active = sections.find((s) => s.id === state.cheat.section) || sections[0];
    state.cheat.section = active.id;
    document.title = "Cheatsheets — ScaleLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Cheatsheets</div>
            <h1>Tra nhanh khi thiết kế</h1>
            <p>Số liệu tham khảo, mẫu thiết kế và quy trình giao hàng để tra nhanh trước khi vẽ kiến trúc.</p>
          </div>
          <div class="mode-head-right">
            <a class="btn btn-ghost" href="#/learn">Vào bài học</a>
            <a class="btn btn-primary" href="#/lab">Mở Design Lab</a>
          </div>
        </div>
        <div class="cheat-layout">
          <nav class="cheat-tabs" aria-label="Các mục cheatsheet">
            ${sections.map((s) => `<a class="cheat-tab${s.id === active.id ? " is-active" : ""}" href="#/cheatsheets/${s.id}"><span class="cheat-tab-num">${s.num}</span><span>${esc(s.title)}</span></a>`).join("")}
          </nav>
          <div class="cheat-content">
            <div class="cheat-search">
              ${UI_ICONS.search}
              <input id="cheatSearch" type="search" placeholder="Tìm trong mục này..." value="${esc(state.cheat.query)}" aria-label="Tìm trong cheatsheet">
            </div>
            <div id="cheatContent">${cheatContentHTML(active)}</div>
          </div>
        </div>
      </div>`;
    initCalcs();
  }

  function cheatContentHTML(section) {
    const query = state.cheat.query.trim().toLowerCase();
    const cards = section.cards.filter((card) => {
      if (!query) return true;
      return `${card.title} ${stripHTML(card.html)}`.toLowerCase().includes(query);
    });
    const intro = `
      <div class="cheat-intro">
        <h2>${esc(section.title)}</h2>
        <p>${esc(section.intro)}</p>
        ${query ? `<p style="margin-top:6px;font-size:.68rem;color:var(--text-faint)">${cards.length} kết quả cho “${esc(state.cheat.query.trim())}”.</p>` : ""}
      </div>`;
    if (!cards.length) {
      return `${intro}<div class="no-results">Không tìm thấy nội dung phù hợp. <button class="btn btn-ghost btn-sm" type="button" data-action="clear-cheat-search" style="margin-left:6px">Xóa tìm kiếm</button></div>`;
    }
    return `${intro}<div class="cheat-grid">${cards.map((card, i) => `
      <article class="cheat-card${card.wide ? " wide" : ""}">
        <h3><span class="num">${section.num}.${String(i + 1).padStart(2, "0")}</span>${esc(card.title)}</h3>
        ${card.html}
      </article>`).join("")}</div>`;
  }

  function renderCheatContent() {
    const content = $("#cheatContent");
    const section = SL.cheatsheets.find((s) => s.id === state.cheat.section) || SL.cheatsheets[0];
    if (!content || !section) return;
    content.innerHTML = cheatContentHTML(section);
    initCalcs();
  }

  function formatDecimal(value, digits) {
    return Number(value).toLocaleString("vi-VN", { maximumFractionDigits: digits == null ? 2 : digits });
  }

  function formatDuration(minutes) {
    if (minutes >= 1440) return `${formatDecimal(minutes / 1440, 2)} ngày`;
    if (minutes >= 60) return `${formatDecimal(minutes / 60, 2)} giờ`;
    if (minutes >= 1) return `${formatDecimal(minutes, 2)} phút`;
    return `${formatDecimal(minutes * 60, 1)} giây`;
  }

  function initCalcs() {
    const avail = $("#availSelect");
    if (avail) {
      const out = $("#availOut");
      const update = () => {
        const nines = parseFloat(avail.value);
        const minutes = 525600 * (1 - nines / 100);
        if (!out) return;
        const b = out.querySelector("b");
        const small = out.querySelector("small");
        if (b) b.textContent = formatDuration(minutes);
        if (small) small.textContent = `≈ ${formatDuration(minutes / 12)} mỗi tháng`;
      };
      avail.addEventListener("change", update);
      update();
    }

    const capDau = $("#capDau");
    if (capDau) {
      const ids = ["capDau", "capReq", "capPeak", "capServer"];
      const update = () => {
        const dau = Math.max(0, Number($("#capDau").value) || 0);
        const req = Math.max(0, Number($("#capReq").value) || 0);
        const peak = Math.max(1, Number($("#capPeak").value) || 1);
        const perServer = Math.max(1, Number($("#capServer").value) || 1);
        const peakRps = dau * req / 86400 * peak;
        const servers = Math.max(1, Math.ceil(peakRps / perServer));
        const out = $("#capOut");
        if (!out) return;
        const b = out.querySelector("b");
        const small = out.querySelector("small");
        if (b) b.textContent = `${formatInt(peakRps)} RPS`;
        if (small) small.textContent = `≈ ${servers} app server ở ${formatInt(perServer)} RPS/server (chưa gồm biên an toàn)`;
      };
      ids.forEach((id) => {
        const input = $(`#${id}`);
        if (input) input.addEventListener("input", update);
      });
      update();
    }

    const stoUsers = $("#stoUsers");
    if (stoUsers) {
      const ids = ["stoUsers", "stoItems", "stoSize", "stoRepl"];
      const update = () => {
        const users = Math.max(0, Number($("#stoUsers").value) || 0);
        const items = Math.max(0, Number($("#stoItems").value) || 0);
        const sizeKb = Math.max(0, Number($("#stoSize").value) || 0);
        const repl = Math.max(1, Number($("#stoRepl").value) || 1);
        const totalTb = users * items * sizeKb * repl / 1024 / 1024 / 1024;
        const out = $("#stoOut");
        if (!out) return;
        const b = out.querySelector("b");
        const small = out.querySelector("small");
        if (b) b.textContent = totalTb >= 1 ? `${formatDecimal(totalTb, 2)} TB` : `${formatDecimal(totalTb * 1024, 1)} GB`;
        if (small) small.textContent = `Dữ liệu gốc × ${repl} bản sao, chưa gồm index/backup`;
      };
      ids.forEach((id) => {
        const input = $(`#${id}`);
        if (input) input.addEventListener("input", update);
      });
      update();
    }

    const cacheRps = $("#cacheRps");
    if (cacheRps) {
      const ids = ["cacheRps", "cacheHit"];
      const update = () => {
        const rps = Math.max(0, Number($("#cacheRps").value) || 0);
        const hit = clamp(Number($("#cacheHit").value) || 0, 0, 100);
        const out = $("#cacheOut");
        if (!out) return;
        const b = out.querySelector("b");
        const small = out.querySelector("small");
        if (b) b.textContent = `${formatInt(rps * (1 - hit / 100))} RPS`;
        if (small) small.textContent = hit > 0 ? `Giảm ${formatInt(hit)}% so với không cache` : "Không giảm tải database";
      };
      ids.forEach((id) => {
        const input = $(`#${id}`);
        if (input) input.addEventListener("input", update);
      });
      update();
    }
  }

  /* ----------------------------------------------------------
     View event handlers
     ---------------------------------------------------------- */
  function handleViewClick(e) {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn && state.route.view === "learn" && !e.target.closest("[data-action]")) {
      const target = parseInt(stepBtn.dataset.step, 10);
      if (target) goToStep(target);
      return;
    }
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "fullscreen") toggleFullscreen();
    else if (action === "toggle-play") togglePlayer();
    else if (action === "replay") replayLesson();
    else if (action === "prev-step") goToStep(state.lesson.step - 1);
    else if (action === "next-step") goToStep(state.lesson.step + 1);
    else if (action === "cycle-speed") cycleSpeed();
    else if (action === "restart-practice") restartPractice();
    else if (action === "answer") answerPractice(parseInt(btn.dataset.option, 10));
    else if (action === "next-question") nextPracticeQuestion();
    else if (action === "clear-cheat-search") {
      state.cheat.query = "";
      const input = $("#cheatSearch");
      if (input) input.value = "";
      renderCheatContent();
      if (input) input.focus();
    } else if (action === "lab-preset") {
      applyLabPreset(btn.dataset.preset);
      renderLab();
    } else if (action === "lab-add") {
      addLabComponent(btn.dataset.key);
    } else if (action === "lab-remove") {
      removeLabComponent(btn.dataset.key);
    } else if (action === "lab-move") {
      moveLabComponent(btn.dataset.key, parseInt(btn.dataset.dir, 10));
    } else if (action === "lab-rep") {
      changeLabReplicas(btn.dataset.key, parseInt(btn.dataset.delta, 10));
    } else if (action === "toggle-lab-run") {
      toggleLabRun();
    } else if (action === "lab-reset") {
      applyLabPreset("sale");
      renderLab();
      toast("Đã đưa Design Lab về cấu hình mặc định.");
    }
  }

  function handleViewInput(e) {
    if (e.target.id === "cheatSearch") {
      state.cheat.query = e.target.value;
      renderCheatContent();
      return;
    }
    const range = e.target.closest("[data-lab-range]");
    if (!range || !state.lab) return;
    const kind = range.dataset.labRange;
    if (kind === "rps") {
      state.lab.rps = clamp(Number(range.value) || 100, 100, 30000);
      const val = $("#labRpsVal");
      if (val) val.textContent = `${formatInt(state.lab.rps)} RPS`;
    } else if (kind === "cacheHit") {
      state.lab.cacheHit = clamp(Number(range.value) || 0, 0, 95);
      const val = $("#labCacheVal");
      if (val) val.textContent = `${state.lab.cacheHit}%`;
    }
    state.lab.preset = null;
    updateLab();
  }

  function handleViewChange(e) {
    const range = e.target.closest("[data-lab-range]");
    if (range && state.lab) updateLab();
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    initTheme();
    buildSearchIndex();
    bindGlobalEvents();
    updateChrome();
    syncTopbarOffset();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTopbarOffset);
    onRoute();
  }

  init();
})();
