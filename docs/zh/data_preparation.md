# 输入数据

将 `Published_Data_non_NASH` 放在克隆的 MELON 目录中，或用 `MELON_PUBLISHED_DATA` 指定路径。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

各 notebook 直接读取模态文件，按 barcode 对齐 spot：

- 小鼠 E15.5 大脑：`mRNA_data.h5`、`ATAC_data.h5` 和 `coords.csv`；notebook 中保留 RNA 归一化与 ATAC TF-IDF/LSI。
- 人淋巴结：`adata_RNA.h5ad` 和 `adata_ADT.h5ad`；在 notebook 中对两个模态归一化。
- 小鼠 E13 胚胎：`adata_RNA.h5ad` 和 `adata_ATAC.h5ad`；在 notebook 中对两个模态归一化。
- 人扁桃体：预处理后的 `adata_RNA.h5ad`、`adata_protein.h5ad` 和 `adata_image.h5ad`。
- 五模态小鼠大脑：预处理后的 `adata_RNA.h5ad`、`adata_Protein.h5ad`、`adata_ATAC.h5ad`、`adata_H3K27ac.h5ad` 和 `adata_H3K27me3.h5ad`，每个模态每个 spot 为 30 维。
- 受控模拟：各 seed 对应的 `X_rna.npy`、`X_atac.npy` 和 `meta.csv`。

H5AD 文件的 `.X` 存储特征矩阵，`.obs_names` 存储 barcode，`.obsm["spatial"]` 存储空间坐标。文件路径和预处理参数直接展示在各 notebook 中。

E15 下游分析还使用 `02_model_inputs/downstream/rna_log1p.h5ad`、`02_model_inputs/downstream/decoder_inputs.npz`，以及 `01_source_data/external_references/` 中的两份参考标签 CSV。

各数据集的具体路径直接展示在 notebook 中。中间结果先保存，再由后面的 cell 读取。
