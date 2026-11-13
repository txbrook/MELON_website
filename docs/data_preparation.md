# Input data

Place `Published_Data_non_NASH` in the cloned MELON directory, or set `MELON_PUBLISHED_DATA` to its location. The notebooks start from preprocessed inputs.

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

`features.npz` contains unique string `barcodes`, an `N × 2` `coords` array, and one `N × features` array per modality. All arrays use the same spot order.

```python
from melon_pkg.preprocessing import load_features

barcodes, coords, features = load_features(
    DATA / "02_model_inputs/MELON/features.npz", ["RNA", "ATAC"]
)
```

The E15 downstream analysis also uses `02_model_inputs/downstream/rna_log1p.h5ad`, `02_model_inputs/downstream/decoder_inputs.npz`, and the two reference-label CSVs under `01_source_data/external_references/`.

Dataset-specific paths are shown in each notebook. Intermediate analysis files are saved before they are read by later cells.
