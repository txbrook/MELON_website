# 入力データ

`Published_Data_non_NASH` をクローンした MELON ディレクトリに配置するか、`MELON_PUBLISHED_DATA` でパスを指定します。Notebook は前処理済みの入力から始まります。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

`features.npz` は一意の文字列 `barcodes`、`N × 2` の `coords`、各モダリティの `N × features` 配列を含みます。すべての配列でスポットの順序を一致させます。

```python
from melon_pkg.preprocessing import load_features

barcodes, coords, features = load_features(
    DATA / "02_model_inputs/MELON/features.npz", ["RNA", "ATAC"]
)
```

E15 の下流解析では `02_model_inputs/downstream/rna_log1p.h5ad`、`02_model_inputs/downstream/decoder_inputs.npz`、`01_source_data/external_references/` 内の 2 つの参照ラベル CSV も使用します。

データセットごとのパスは各 notebook に記載されています。中間結果は保存してから後続のセルで読み込みます。
