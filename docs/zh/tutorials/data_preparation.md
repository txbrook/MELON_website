# 数据准备

MELON 需要三类输入：

1. **模态 1 DataFrame** —— `pandas.DataFrame`，形状为 `(n_spots, n_features_1)`
2. **模态 2 DataFrame** —— `pandas.DataFrame`，形状为 `(n_spots, n_features_2)`
3. **坐标 CSV** —— 一个 CSV 文件，索引为 barcode，列为 `x`、`y`

## 从 H5 文件加载

MELON 提供 `load_custom_h5`，用于加载存储在 HDF5 格式中的数据：

```python
from melon_pkg import load_custom_h5

# 基因表达 (默认 feature_key='gene')
mod1_df = load_custom_h5("rna.h5", feature_key="gene")

# 蛋白表达
mod2_df = load_custom_h5("protein.h5", feature_key="gene")
```

H5 文件中必须包含：
- `X` —— 数据矩阵
- `spot` —— barcode 名称
- 一个 feature key（默认 `"gene"`）—— 特征 / 基因名称

## 坐标文件格式

坐标 CSV 应当是这样的形式：

```
,x,y
BARCODE_1,100.5,200.3
BARCODE_2,101.2,199.8
...
```

- **索引**：barcode 字符串（必须与 DataFrame 的索引一致）
- **列**：`x` 与 `y`（空间坐标）

:::{note}
Barcode 会被自动转换为字符串，并在三个输入之间取交集。
只有共有的 barcode 会用于训练。
:::
