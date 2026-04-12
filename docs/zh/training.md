# 训练参数

`MELON()` 函数接受许多参数来控制训练行为。

## 核心参数

| 参数 | 默认值 | 说明 |
|-----------|---------|-------------|
| `epochs` | `100` | 训练轮数 |
| `embed_dim` | `128` | 潜在嵌入维度 |
| `batch_size` | `2048` | 训练批大小 |
| `learning_rate` | `1e-3` | AdamW 学习率 |
| `weight_decay` | `1e-5` | AdamW 权重衰减 |
| `temperature` | `0.1` | 对比损失温度 |

## 空间注意力

| 参数 | 默认值 | 说明 |
|-----------|---------|-------------|
| `use_spatial_attention` | `True` | 启用 NeighborhoodGAT 的注意力偏置 |
| `neighbor_k` | `16` | kNN 图中的最近邻数 |
| `gat_hidden` | `64` | GAT 的隐藏维度 |
| `gat_heads` | `8` | GAT 注意力头的数量 |
| `gat_dropout` | `0.1` | GAT 中的 dropout 概率 |

## 融合策略

| 参数 | 默认值 | 说明 |
|-----------|---------|-------------|
| `fusion` | `"concat"` | 融合策略：`"concat"` 或 `"x-attn"` |
| `fusion_heads` | `8` | 融合 transformer 的注意力头数 |
| `fusion_layers` | `1` | transformer 层数 |
| `spot_tokenization` | `True` | 把每个 spot 当作一个 token |

:::{warning}
交叉注意力融合 (`"x-attn"`) 不支持空间注意力 mask 和 spot tokenization。
当 `fusion="x-attn"` 时，这些选项会被自动关闭。
:::

## 数据增广设置

| 参数 | 默认值 | 说明 |
|-----------|---------|-------------|
| `augmentations` | `("gaussian_noise", "feature_dropout", "neighbor_mix")` | 增广类型 |
| `augment_p` | `0.8` | 每种增广的应用概率 |
| `augment_random_choice` | `False` | 若为 `True`，每个视图随机挑一种增广 |

可用的增广方式：
- `gaussian_noise` —— 加 N(0, 0.05) 噪声
- `feature_dropout` —— 把 20% 的特征置零
- `spot_dropout` —— 把 10% 的 spot 置零
- `scaled_perturb` —— 随机强度缩放
- `neighbor_mix` —— 与空间邻居做 mixup
- `simclr` —— 组合：噪声 + 特征 dropout

在评估阶段关闭增广：

```python
model, *_ = MELON(mod1_df, mod2_df, coords_path, augmentations=())
```

## 完整示例

```python
model, mod1_t, mod2_t, coords_t, mask = MELON(
    mod1_df,
    mod2_df,
    coords_path,
    epochs=200,
    embed_dim=256,
    fusion="concat",
    fusion_heads=8,
    fusion_layers=2,
    use_spatial_attention=True,
    neighbor_k=20,
    augmentations=("gaussian_noise", "feature_dropout", "neighbor_mix"),
    augment_p=0.8,
    batch_size=1024,
    learning_rate=5e-4,
    temperature=0.07,
)
```
