# 示例：小鼠 E15.5 大脑 (RNA + ATAC)

本教程在一个真实数据集上演示完整的 MELON 工作流：
**小鼠胚胎大脑 (E15.5)**，配对的 RNA 和 ATAC-seq。

## 数据集概览

| 属性 | 取值 |
|----------|-------|
| 组织 | 小鼠胚胎大脑 (E15.5) |
| 点位数 | 1,949 |
| 模态 1 (RNA) | 2,144 个基因 |
| 模态 2 (ATAC) | 47,287 个 peaks（降到 50 维 LSI 分量） |
| 注释 | 12 个脑区 (diencephalon, cartilage, hindbrain, dpallm, mesenchyme, midbrain, skull, subpallium, muscle, cerebellar vermis, dpallv, thalamus) |

数据存放在 `Mouse_E15.5/` 目录下，包括以下文件：

```
Mouse_E15.5/
├── mRNA_data.h5        # 基因表达 (H5 格式)
├── ATAC_data.h5        # 染色质可及性 (H5 格式)
├── coords.csv          # 空间坐标 (barcode, x, y)
└── truth.csv           # 脑区真值标注
```

## 步骤 1：训练 MELON

假设你已经在本工作区中，并激活了教程使用的 `uv` 环境：

```bash
source .venv_uv_legacy/bin/activate
```

通过 CLI 运行 MELON。由于 ATAC 模态有 47K 个 peaks，我们在训练前
先用 **TF-IDF + LSI** 将其降到 50 维：

```bash
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \    # 模态 1：RNA 表达 (H5)
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \    # 模态 2：ATAC peaks (H5)
    --coords_csv Mouse_E15.5/coords.csv \   # 空间坐标 (barcode, x, y)
    --atac_preprocess tfidf_lsi \           # 用 TF-IDF + LSI 压缩 47K 个 peaks
    --output_dir results/example_mouse_e15 \# 嵌入与产物的输出目录
    --epochs 100 \                          # 训练轮数
    --seed 42                               # 随机种子，保证可复现
```

:::{note}
`--atac_preprocess tfidf_lsi` 这一参数会先做 TF-IDF 归一化，再用截断 SVD (LSI)
将高维的 ATAC peak 矩阵压缩到一个紧凑的表示。这是处理 ATAC-seq 数据的推荐做法。
:::

## 步骤 2：对嵌入进行聚类

训练命令会把 `latent_melon.csv` 写到输出目录。
用 CLI 对这个嵌入做聚类，本教程默认使用 `leiden`：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \   # 步骤 1 输出的目录（包含 latent_melon.csv）
    --coords_csv Mouse_E15.5/coords.csv \     # 空间坐标 (barcode, x, y)
    --target_k 12 \                           # 期望的聚类个数
    --methods leiden                          # 使用的聚类算法
```

会得到：

```text
results/example_mouse_e15/
├── latent_melon.csv
├── clusters_k12.csv
├── clusters_leiden_k12.csv
└── ...
```

如果你想同时比较多种聚类方法，可以运行：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```

## 结果

使用本教程的配置（`uv` venv，epochs=100，embed_dim=128，
ATAC 走 TF-IDF+LSI，seed=42），MELON 的 Leiden 聚类结果在空间上结构清晰，
在嵌入空间中也能很好地分开：

```{image} /_static/mouse_e15_spatial_umap.png
:alt: 小鼠 E15.5 大脑 — MELON Leiden 聚类的空间布局与潜在嵌入的 UMAP
:width: 100%
```

左：聚类在组织坐标系中的分布。右：MELON 潜在嵌入的 UMAP，
按相同的聚类标签着色。

### 如何选择 `--target_k`

`--target_k` 是你希望算法返回的聚类个数。
对于自己的数据集，几乎总是要根据情况调整 —— 没有放之四海皆准的"正确值"，
最佳取值取决于你关心的生物学分辨率。一些实用建议：

- **从先验知识出发。** 如果对组织区域、细胞类型或组织学结构数有大致预期，
  就用它作为 `--target_k` 的初始值。在小鼠 E15.5 这个例子里我们用 `12`，
  是因为参考注释定义了 12 个脑区。
- **扫一段范围。** 如果不知道"真实的"个数，可以做一个小范围扫描
  （例如 `8, 10, 12, 15, 20`），把空间图和 UMAP 并排比较。
  选择那种聚类在空间上连贯、生物学上可解释，而不是碎片化或被过度合并的取值。
- **k 越小，区域越粗；k 越大，越细分。** 如果聚类把明显的解剖边界混在一起，
  就增大 k；如果出现一堆零碎、没有空间规律的小簇，就减小 k。
- **`target_k` 是一个目标，不是硬约束。** 像 Leiden / Louvain 这种基于图的方法
  会通过调 resolution 来逼近目标值，最终的簇数可能接近但不严格等于 `k`。
  而 `kmeans` 和 `gmm` 会严格返回 `k` 个簇。
- **重跑很便宜。** `melon-cluster` 只是基于已缓存的 `latent_melon.csv` 重新聚类，
  改 `--target_k` **不需要**重新训练 MELON，几秒钟就能跑完。

例如，要在同一份训练好的嵌入上尝试一个更细的分辨率：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 18 \
    --methods leiden
```

## 完整 CLI 参考

```bash
# 训练
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \
    --coords_csv Mouse_E15.5/coords.csv \
    --atac_preprocess tfidf_lsi \
    --output_dir results/example_mouse_e15 \
    --epochs 100 \
    --seed 42

# 聚类
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods leiden

# 可选：比较多种聚类方法
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```
