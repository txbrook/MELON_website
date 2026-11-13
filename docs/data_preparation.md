# Input data

Place `Published_Data_non_NASH` in the cloned MELON directory, or set `MELON_PUBLISHED_DATA` to its location.

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

Each notebook reads the modality files directly and aligns spots by barcode:

- Mouse E15.5 brain: `mRNA_data.h5`, `ATAC_data.h5`, and `coords.csv`; RNA normalization and ATAC TF-IDF/LSI are included in the notebook.
- Human lymph node: `adata_RNA.h5ad` and `adata_ADT.h5ad`; both modalities are normalized in the notebook.
- Mouse E13 embryo: `adata_RNA.h5ad` and `adata_ATAC.h5ad`; both modalities are normalized in the notebook.
- Human tonsil: preprocessed `adata_RNA.h5ad`, `adata_protein.h5ad`, and `adata_image.h5ad`.
- Five-modality mouse brain: preprocessed `adata_RNA.h5ad`, `adata_Protein.h5ad`, `adata_ATAC.h5ad`, `adata_H3K27ac.h5ad`, and `adata_H3K27me3.h5ad`, each containing 30 features per spot.
- Controlled simulation: `X_rna.npy`, `X_atac.npy`, and `meta.csv` for each seed.

H5AD files store the feature matrix in `.X`, barcodes in `.obs_names`, and spatial coordinates in `.obsm["spatial"]`. File paths and preprocessing parameters are shown directly in each notebook.

The E15 downstream analysis also uses `02_model_inputs/downstream/rna_log1p.h5ad`, `02_model_inputs/downstream/decoder_inputs.npz`, and the two reference-label CSVs under `01_source_data/external_references/`.

Dataset-specific paths are shown in each notebook. Intermediate analysis files are saved before they are read by later cells.
