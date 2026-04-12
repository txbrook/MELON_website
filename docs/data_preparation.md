# Data Preparation

MELON expects three inputs:

1. **Modality 1 DataFrame** — `pandas.DataFrame` with shape `(n_spots, n_features_1)`
2. **Modality 2 DataFrame** — `pandas.DataFrame` with shape `(n_spots, n_features_2)`
3. **Coordinates CSV** — A CSV file with barcode index and columns `x`, `y`

## Loading from H5 Files

MELON provides `load_custom_h5` for loading data stored in HDF5 format:

```python
from melon_pkg import load_custom_h5

# Gene expression (default feature_key='gene')
mod1_df = load_custom_h5("rna.h5", feature_key="gene")

# Protein expression
mod2_df = load_custom_h5("protein.h5", feature_key="gene")
```

The H5 file must contain:
- `X` — the data matrix
- `spot` — barcode names
- A feature key (default `"gene"`) — feature/gene names

## Coordinate File Format

The coordinates CSV should look like:

```
,x,y
BARCODE_1,100.5,200.3
BARCODE_2,101.2,199.8
...
```

- **Index**: barcode strings (must match the DataFrame indices)
- **Columns**: `x` and `y` (spatial coordinates)

:::{note}
Barcodes are automatically cast to strings and intersected across all three inputs.
Only shared barcodes are used for training.
:::
