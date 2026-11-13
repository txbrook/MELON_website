document.addEventListener("DOMContentLoaded", function () {
  // ---- Sidebar toggle (hamburger top-left) ----
  var btn = document.createElement("button");
  btn.id = "sidebar-toggle-btn";
  btn.title = "Toggle sidebar";
  btn.setAttribute("aria-label", "Toggle sidebar");
  btn.setAttribute("aria-controls", "pst-primary-sidebar");
  for (var i = 0; i < 3; i++) {
    btn.appendChild(document.createElement("span"));
  }
  document.body.appendChild(btn);

  if (localStorage.getItem("sidebar-hidden") === "true") {
    document.body.classList.add("sidebar-collapsed");
  }

  var mobileSidebar = document.getElementById("pst-primary-sidebar-modal");
  function updateSidebarState() {
    var mobile = window.matchMedia("(max-width: 959.98px)").matches;
    btn.setAttribute("aria-controls", mobile ? "pst-primary-sidebar-modal" : "pst-primary-sidebar");
    btn.setAttribute("aria-expanded", mobile ? Boolean(mobileSidebar && mobileSidebar.open) : !document.body.classList.contains("sidebar-collapsed"));
  }
  updateSidebarState();
  window.addEventListener("resize", updateSidebarState);
  if (mobileSidebar) {
    mobileSidebar.addEventListener("close", function () {
      updateSidebarState();
      btn.focus();
    });
  }

  btn.addEventListener("click", function () {
    if (window.matchMedia("(max-width: 959.98px)").matches) {
      var nativeToggle = document.querySelector(".primary-toggle");
      if (nativeToggle) nativeToggle.click();
      updateSidebarState();
      return;
    }
    document.body.classList.toggle("sidebar-collapsed");
    localStorage.setItem(
      "sidebar-hidden",
      document.body.classList.contains("sidebar-collapsed")
    );
    updateSidebarState();
  });

  // ---- Dark / light theme toggle (top-right) ----
  var moonSVG =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var sunSVG =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' +
    '</svg>';

  var themeBtn = document.createElement("button");
  themeBtn.id = "theme-toggle-btn";
  themeBtn.title = "Toggle dark mode";
  themeBtn.setAttribute("aria-label", "Toggle dark mode");
  themeBtn.innerHTML = moonSVG;
  document.body.appendChild(themeBtn);

  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    themeBtn.innerHTML = mode === "dark" ? sunSVG : moonSVG;
  }

  var saved = localStorage.getItem("melon-theme");
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  themeBtn.addEventListener("click", function () {
    var current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("melon-theme", next);
  });

  // ---- Language toggle (EN -> 中 -> 日 -> EN) ----
  var docOptions =
    typeof DOCUMENTATION_OPTIONS !== "undefined"
      ? DOCUMENTATION_OPTIONS
      : window.DOCUMENTATION_OPTIONS;
  var docPageName = docOptions && docOptions.pagename
    ? docOptions.pagename.replace(/^(zh|ja)\//, "")
    : "";
  var pageRelPath =
    (docPageName
      ? "/" + docPageName + ".html"
      : "/" + location.pathname.replace(/^.*\//, ""));
  var path = location.pathname;

  var langs = ["en", "zh", "ja"];
  var labels = { en: "EN", zh: "中", ja: "日" };
  var current = "en";
  if (path.endsWith("/zh" + pageRelPath)) {
    current = "zh";
  } else if (path.endsWith("/ja" + pageRelPath)) {
    current = "ja";
  }

  var basePrefix = "";
  if (current === "en" && path.endsWith(pageRelPath)) {
    basePrefix = path.slice(0, -pageRelPath.length);
  } else {
    var langSuffix = "/" + current + pageRelPath;
    if (path.endsWith(langSuffix)) {
      basePrefix = path.slice(0, -langSuffix.length);
    }
  }

  var langBtn = document.createElement("a");
  langBtn.id = "lang-toggle-btn";
  langBtn.title = "Switch language / 切换语言 / 言語切替";
  langBtn.setAttribute("aria-label", "Switch language");
  langBtn.setAttribute("role", "button");
  var nextLang = langs[(langs.indexOf(current) + 1) % langs.length];
  langBtn.textContent = labels[nextLang];
  var idx = langs.indexOf(current);
  var next = langs[(idx + 1) % langs.length];
  function updateLanguageTarget() {
    var target = new URL(location.href);
    target.pathname = basePrefix + (next === "en" ? "" : "/" + next) + pageRelPath;
    var cell = location.hash.match(/^#(?:en|zh|ja)-(.+-cell-\d+)$/);
    target.hash = cell ? "#" + next + "-" + cell[1] : "";
    langBtn.href = target.href;
  }
  updateLanguageTarget();
  window.addEventListener("hashchange", updateLanguageTarget);
  document.body.appendChild(langBtn);
});
