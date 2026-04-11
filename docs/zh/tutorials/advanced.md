# 进阶主题

## 自定义增广

你可以传入自己的 `SpatialOmicsAugmentations` 实例：

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

## 融合模式

MELON 在 `MMFusion` 编码器中支持两种融合策略：

### 拼接（默认）

来自所有模态的 token 沿序列维度拼接，再送入若干 self-attention 层处理。

```python
model, *_ = MELON(..., fusion="concat", spot_tokenization=True)
```

### 交叉注意力

每个模态通过 cross-attention 模块去注意另一个模态，然后将输出拼接并做平均池化。

```python
model, *_ = MELON(..., fusion="x-attn")
```

:::{warning}
交叉注意力不支持空间注意力或 spot tokenization。
:::

## 模型架构概览

```
输入: mod1_df (N, G), mod2_df (N, P), coords (N, 2)
  |
  v
编码器: MLP (G -> E), MLP (P -> E)
  |
  v
SpotTokenAdapter: 每个模态 (N, E) -> (1, N, E)
  |
  v
MMFusion / FusionTransformer: 拼接 + self-attention
  |  (可选: 由 coords 提供的 NeighborhoodGAT 注意力偏置)
  v
投影 MLP: E -> 256 -> E
  |
  v
MELONLoss: 跨视图、跨模态的 InfoNCE
```
