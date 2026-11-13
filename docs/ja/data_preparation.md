# 入力データ

`Published_Data_non_NASH` をクローンした MELON ディレクトリに配置するか、`MELON_PUBLISHED_DATA` でパスを指定します。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

各 notebook はモダリティ別のファイルを直接読み込み、バーコードでスポットを揃えます。

- マウス E15.5 脳：`mRNA_data.h5`、`ATAC_data.h5`、`coords.csv`。RNA の正規化と ATAC の TF-IDF/LSI を notebook 内で行います。
- ヒトリンパ節：`adata_RNA.h5ad` と `adata_ADT.h5ad`。両モダリティを notebook 内で正規化します。
- マウス E13 胚：`adata_RNA.h5ad` と `adata_ATAC.h5ad`。両モダリティを notebook 内で正規化します。
- ヒト扁桃：前処理済みの `adata_RNA.h5ad`、`adata_protein.h5ad`、`adata_image.h5ad`。
- 5 モダリティのマウス脳：前処理済みの `adata_RNA.h5ad`、`adata_Protein.h5ad`、`adata_ATAC.h5ad`、`adata_H3K27ac.h5ad`、`adata_H3K27me3.h5ad`。各モダリティはスポットごとに 30 次元です。
- 制御シミュレーション：各シードの `X_rna.npy`、`X_atac.npy`、`meta.csv`。

H5AD ファイルの `.X` に特徴量行列、`.obs_names` にバーコード、`.obsm["spatial"]` に空間座標を格納します。ファイルパスと前処理パラメータは各 notebook に直接記載されています。

E15 の下流解析では `02_model_inputs/downstream/rna_log1p.h5ad`、`02_model_inputs/downstream/decoder_inputs.npz`、`01_source_data/external_references/` 内の 2 つの参照ラベル CSV も使用します。

データセットごとのパスは各 notebook に記載されています。中間結果は保存してから後続のセルで読み込みます。
