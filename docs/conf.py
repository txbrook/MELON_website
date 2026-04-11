# -- Project information -------------------------------------------------------
project = "MELON"
copyright = "2025, MELON Team"
author = "MELON Team"
release = "0.1.0"

# -- General configuration -----------------------------------------------------
extensions = [
    "sphinx_copybutton",          # Copy button on code blocks
    "sphinx_design",              # Callouts, grids
    "myst_parser",                # Write pages in Markdown (*.md)
]

source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

# -- MyST-Parser settings ------------------------------------------------------
myst_enable_extensions = [
    "colon_fence",
    "fieldlist",
    "deflist",
]

# -- HTML output ---------------------------------------------------------------
html_theme = "pydata_sphinx_theme"
html_static_path = ["_static"]

html_theme_options = {
    "logo": {
        "text": "MELON Tutorials",
    },
    "show_toc_level": 2,
    "navigation_with_keys": True,
    # Show all nav levels in sidebar (key fix: 0 = show everything)
    "show_nav_level": 0,
    "navigation_depth": 3,
    # Minimal top bar
    "navbar_start": [],
    "navbar_center": [],
    "navbar_end": [],
    # Right sidebar: page-level TOC
    "secondary_sidebar_items": ["page-toc"],
    "primary_sidebar_end": [],
}

# Left sidebar: use globaltoc to show full tree
html_sidebars = {
    "**": ["globaltoc.html"],
}

html_context = {
    "default_mode": "light",
}

# Hide the top navbar via custom CSS + sidebar toggle
html_css_files = ["custom.css"]
html_js_files = ["sidebar-controls.js"]
