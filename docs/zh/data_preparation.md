# 输入数据

将 `Published_Data_non_NASH` 放在克隆的 MELON 目录中，或用 `MELON_PUBLISHED_DATA` 指定路径。Notebook 从预处理后的输入开始。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

`features.npz` 包含唯一的字符串 `barcodes`、`N × 2` 的 `coords`，以及每个模态对应的 `N × features` 数组。所有数组的 spot 顺序一致。

```python
from melon_pkg.preprocessing import load_features

barcodes, coords, features = load_features(
    DATA / "02_model_inputs/MELON/features.npz", ["RNA", "ATAC"]
)
```

E15 下游分析还使用 `02_model_inputs/downstream/rna_log1p.h5ad`、`02_model_inputs/downstream/decoder_inputs.npz`，以及 `01_source_data/external_references/` 中的两份参考标签 CSV。

各数据集的具体路径直接展示在 notebook 中。中间结果先保存，再由后面的 cell 读取。
