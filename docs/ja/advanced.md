# 上級トピック

## カスタム拡張

自前の `SpatialOmicsAugmentations` インスタンスを渡すことができます：

```python
from melon_pkg import MELON, SpatialOmicsAugmentations

aug_strong = SpatialOmicsAugmentations(
    augmentations=["gaussian_noise", "feature_dropout", "neighbor_mix"],
    p=0.9,
    random_choice=False,
)

aug_weak = SpatialOmicsAugmentations(
    augmentations=["gaussian_noise"],
    p=0.5,
)

model, *_ = MELON(
    mod1_df, mod2_df, coords_path,
    augmentA=aug_strong,
    augmentB=aug_weak,
)
```

## 融合モード

MELON は `MMFusion` エンコーダで 2 種類の融合方式をサポートしています：

### 連結（デフォルト）

すべてのモダリティのトークンを系列方向に連結し、self-attention 層で処理します。

```python
model, *_ = MELON(..., fusion="concat", spot_tokenization=True)
```

### クロスアテンション

各モダリティが cross-attention ブロックを通じて他方のモダリティを注視し、
出力を連結したうえで平均プーリングします。

```python
model, *_ = MELON(..., fusion="x-attn")
```

:::{warning}
クロスアテンションは空間アテンションや spot tokenization をサポートしません。
:::

## モデルアーキテクチャ概要

```
入力: mod1_df (N, G), mod2_df (N, P), coords (N, 2)
  |
  v
エンコーダ: MLP (G -> E), MLP (P -> E)
  |
  v
SpotTokenAdapter: 各モダリティで (N, E) -> (1, N, E)
  |
  v
MMFusion / FusionTransformer: 連結 + self-attention
  |  (オプション: coords から得る NeighborhoodGAT のアテンションバイアス)
  v
射影 MLP: E -> 256 -> E
  |
  v
MELONLoss: view・モダリティ間の InfoNCE
```
