# Example: Mouse E15.5 Brain (RNA + ATAC)

This tutorial walks through a complete MELON workflow on a real dataset:
**mouse embryonic brain (E15.5)** profiled with paired RNA and ATAC-seq.

## Dataset Overview

| Property | Value |
|----------|-------|
| Tissue | Mouse embryonic brain (E15.5) |
| Spots | 1,949 |
| Modality 1 (RNA) | 2,144 genes |
| Modality 2 (ATAC) | 47,287 peaks (reduced to 50 LSI components) |
| Annotations | 12 brain regions (diencephalon, cartilage, hindbrain, dpallm, mesenchyme, midbrain, skull, subpallium, muscle, cerebellar vermis, dpallv, thalamus) |

The data lives in `Mouse_E15.5/` with the following files:

```
Mouse_E15.5/
├── mRNA_data.h5        # Gene expression (H5 format)
├── ATAC_data.h5        # Chromatin accessibility (H5 format)
├── coords.csv          # Spatial coordinates (barcode, x, y)
└── truth.csv           # Ground-truth region annotations
```

## Step 1: Train MELON

Assuming you are in this workspace with the tutorial `uv` environment:

```bash
source .venv_uv_legacy/bin/activate
```

Run MELON via the CLI. Since the ATAC modality has 47K peaks, we apply
**TF-IDF + LSI** to reduce it to 50 components before training:

```bash
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \    # modality 1: RNA expression (H5)
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \    # modality 2: ATAC peaks (H5)
    --coords_csv Mouse_E15.5/coords.csv \   # spatial coordinates (barcode, x, y)
    --atac_preprocess tfidf_lsi \           # TF-IDF + LSI to compress 47K peaks
    --output_dir results/example_mouse_e15 \# where embeddings + artifacts are written
    --epochs 100 \                          # training epochs
    --seed 42                               # random seed for reproducibility
```

:::{note}
The `--atac_preprocess tfidf_lsi` flag applies TF-IDF normalization followed by
Truncated SVD (LSI) to reduce the high-dimensional ATAC peak matrix to a compact
representation. This is recommended for ATAC-seq data.
:::

## Step 2: Cluster Embeddings

The training command writes `latent_melon.csv` into the output directory.
Cluster that embedding with the CLI. The default tutorial example uses
`leiden`:

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \   # directory with latent_melon.csv from Step 1
    --coords_csv Mouse_E15.5/coords.csv \     # spatial coordinates (barcode, x, y)
    --target_k 12 \                           # desired number of clusters
    --methods leiden                          # clustering algorithm to run
```

This produces:

```text
results/example_mouse_e15/
├── latent_melon.csv
├── clusters_k12.csv
├── clusters_leiden_k12.csv
└── ...
```

If you want to compare multiple clustering methods, run:

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```

## Results

Using this tutorial configuration (`uv` venv, epochs=100, embed_dim=128,
TF-IDF+LSI for ATAC, seed=42), the MELON Leiden clusters show clear
spatial structure and well-separated groups in embedding space:

```{image} /_static/mouse_e15_spatial_umap.png
:alt: Mouse E15.5 brain — MELON Leiden clusters in spatial coordinates and UMAP of MELON embedding
:width: 100%
```

Left: clusters laid out in tissue coordinates. Right: UMAP of the MELON
latent embedding, colored by the same cluster labels.

### Choosing `--target_k`

`--target_k` is the number of clusters you want the algorithm to return.
You will almost always want to tune it for your own dataset — there is no
single "right" value, and the best choice depends on the biological
resolution you care about. A few practical guidelines:

- **Start from prior knowledge.** If you have an expected number of tissue
  regions, cell types, or histological domains, use that as your initial
  `--target_k`. For this Mouse E15.5 example we use `12` because the
  reference annotation defines 12 brain regions.
- **Sweep a range.** When you do not know the "true" number, run a small
  sweep (e.g. `8, 10, 12, 15, 20`) and compare the spatial maps and UMAPs
  side by side. Pick the value where clusters look spatially coherent and
  biologically interpretable, rather than fragmented or over-merged.
- **Smaller `k` → coarser domains; larger `k` → finer subtypes.** If
  clusters bleed across obvious anatomical boundaries, increase `k`. If
  you see many tiny, scattered clusters with no clear spatial pattern,
  decrease `k`.
- **`target_k` is a target, not a hard constraint.** Graph-based methods
  like Leiden/Louvain reach the target by tuning resolution and may
  return a number close to (but not exactly) `k`. Methods like `kmeans`
  and `gmm` will return exactly `k`.
- **Re-running is cheap.** `melon-cluster` only re-clusters the cached
  `latent_melon.csv`; you do **not** need to retrain MELON when you change
  `--target_k`. Iterating on `k` takes seconds.

For example, to try a finer resolution on the same trained embedding:

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 18 \
    --methods leiden
```

## Full CLI Reference

```bash
# Training
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \
    --coords_csv Mouse_E15.5/coords.csv \
    --atac_preprocess tfidf_lsi \
    --output_dir results/example_mouse_e15 \
    --epochs 100 \
    --seed 42

# Clustering
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods leiden

# Optional: compare multiple clustering methods
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```
