# データ準備

MELON は次の 3 種類の入力を必要とします：

1. **モダリティ 1 の DataFrame** —— 形状 `(n_spots, n_features_1)` の `pandas.DataFrame`
2. **モダリティ 2 の DataFrame** —— 形状 `(n_spots, n_features_2)` の `pandas.DataFrame`
3. **座標 CSV** —— インデックスが barcode、列が `x`、`y` の CSV ファイル

## H5 ファイルから読み込む

MELON は HDF5 形式で保存されたデータを読み込むための `load_custom_h5` を提供しています：

```python
from melon_pkg import load_custom_h5

# 遺伝子発現 (デフォルト feature_key='gene')
mod1_df = load_custom_h5("rna.h5", feature_key="gene")

# タンパク質発現
mod2_df = load_custom_h5("protein.h5", feature_key="gene")
```

H5 ファイルは次を含んでいる必要があります：
- `X` —— データ行列
- `spot` —— barcode 名
- feature key（デフォルトは `"gene"`） —— 特徴量 / 遺伝子名

## 座標ファイルの形式

座標 CSV は次のようになっている必要があります：

```
,x,y
BARCODE_1,100.5,200.3
BARCODE_2,101.2,199.8
...
```

- **インデックス**：barcode 文字列（DataFrame のインデックスと一致する必要があります）
- **列**：`x` と `y`（空間座標）

:::{note}
Barcode は自動的に文字列にキャストされ、3 つの入力すべてで共通のものに絞られます。
学習に使われるのは共有されている barcode のみです。
:::
