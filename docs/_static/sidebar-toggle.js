document.addEventListener("DOMContentLoaded", function () {
  // ---- Sidebar toggle (hamburger top-left) ----
  var btn = document.createElement("button");
  btn.id = "sidebar-toggle-btn";
  btn.title = "Toggle sidebar";
  for (var i = 0; i < 3; i++) {
    btn.appendChild(document.createElement("span"));
  }
  document.body.appendChild(btn);

  if (localStorage.getItem("sidebar-hidden") === "true") {
    document.body.classList.add("sidebar-collapsed");
  }

  btn.addEventListener("click", function () {
    document.body.classList.toggle("sidebar-collapsed");
    localStorage.setItem(
      "sidebar-hidden",
      document.body.classList.contains("sidebar-collapsed")
    );
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
  var mainEl = document.getElementById("main-content") || document.querySelector(".bd-main") || document.body;
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
  // Each non-English language has its own Sphinx build under /<code>/.
  // We use Sphinx's data-content_root attribute (set on <html>) to robustly
  // resolve the docs build root relative to the current page, regardless of
  // how deep the page is nested.
  var docOptions =
    typeof DOCUMENTATION_OPTIONS !== "undefined"
      ? DOCUMENTATION_OPTIONS
      : window.DOCUMENTATION_OPTIONS;
  var pageRelPath =
    (docOptions && docOptions.pagename
      ? "/" + docOptions.pagename + ".html"
      : "/" + location.pathname.replace(/^.*\//, ""));
  var path = location.pathname;

  // Detect current language from the current pathname and doc-relative suffix.
  var langs = ["en", "zh", "ja"];
  var labels = { en: "EN", zh: "中", ja: "日" };
  var current = "en";
  if (path.endsWith("/zh" + pageRelPath)) {
    current = "zh";
  } else if (path.endsWith("/ja" + pageRelPath)) {
    current = "ja";
  }

  // Prefix before the docs language segment, if any.
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
  // Show the *next* language as the button label, so users know what they'll get.
  var nextLang = langs[(langs.indexOf(current) + 1) % langs.length];
  langBtn.textContent = labels[nextLang];
  var idx = langs.indexOf(current);
  var next = langs[(idx + 1) % langs.length];
  // Precompute href so the control still navigates even if a click handler is blocked.
  try {
    var target = new URL(location.href);
    target.pathname = basePrefix + (next === "en" ? "" : "/" + next) + pageRelPath;
    target.hash = location.hash;
    langBtn.href = target.href;
  } catch (e) {
    langBtn.href = basePrefix + (next === "en" ? "" : "/" + next) + pageRelPath + location.hash;
  }
  document.body.appendChild(langBtn);
});
