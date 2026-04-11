# -- Project information -------------------------------------------------------
project = "MELON"
copyright = "2025, MELON Team"
author = "MELON Team"
release = "0.1.0"
language = "ja"

# -- General configuration -----------------------------------------------------
extensions = [
    "sphinx_copybutton",
    "sphinx_design",
    "myst_parser",
]

source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}

# _templates and _static here are symlinks to ../_templates and ../_static so
# the English, Chinese and Japanese builds share the same custom assets.
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
        "text": "MELON チュートリアル",
    },
    "show_toc_level": 2,
    "navigation_with_keys": True,
    "show_nav_level": 0,
    "navigation_depth": 3,
    "navbar_start": [],
    "navbar_center": [],
    "navbar_end": [],
    "secondary_sidebar_items": ["page-toc"],
    "primary_sidebar_end": [],
}

html_sidebars = {
    "**": ["globaltoc.html"],
}

html_context = {
    "default_mode": "light",
}

html_css_files = ["custom.css"]
html_js_files = ["sidebar-controls.js"]
