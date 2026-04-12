# Quick Start

Get MELON up and running on your machine.

## Prerequisites

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) if you don't have it:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Set Up the Environment

Navigate to the MELON project directory and create a virtual environment:

```bash
cd /path/to/MELON

# Create a virtual environment
uv venv .venv_uv_melon --python 3.12
source .venv_uv_melon/bin/activate

# Install core dependencies
uv pip install torch pytorch-lightning numpy pandas scipy h5py scikit-learn einops scanpy

# Install MELON in editable mode
uv pip install -e .
```

## Verify Installation

```bash
melon-run --help
melon-cluster --help
```

## Input / Output

**Input** — three files:

| Input | Format | Description |
|-------|--------|-------------|
| Modality 1 | `.h5ad` or `DataFrame` (spots x features) | e.g. gene expression |
| Modality 2 | `.h5ad` or `DataFrame` (spots x features) | e.g. protein / ATAC |
| Coordinates | `.csv` with columns `x`, `y` (index = barcodes) | Spatial positions |

**Output** — a joint embedding CSV:

| Output | Format | Description |
|--------|--------|-------------|
| `latent_melon.csv` | `DataFrame` (spots x embed_dim) | Joint latent representation for downstream clustering, visualization, etc. |

## Next Steps

Head to the {doc}`Example: Mouse E15.5 Brain (RNA + ATAC) </example_mouse_e15>`
for a full walkthrough with real data.
