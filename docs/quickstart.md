# Installation and usage

Use Python 3.12.

```bash
git clone https://github.com/txbrook/MELON.git
cd MELON
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[tutorials]" jupyterlab umap-learn requests
```

Place `Published_Data_non_NASH` in the cloned MELON directory, or set `MELON_PUBLISHED_DATA` to its location. The notebooks start from preprocessed inputs.

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

Open a notebook and edit its parameter dictionaries directly.

```bash
jupyter lab Reproduce
```

## Notebooks

- {doc}`Mouse E15.5 brain <example_mouse_e15>`
- {doc}`Human tonsil <human_tonsil>`
- {doc}`Five-modality mouse brain <mouse_brain>`
- {doc}`Human lymph node <human_lymph_node>`
- {doc}`Mouse E13 embryo <mouse_e13_embryo>`
- {doc}`Controlled simulation <controlled_simulation>`
