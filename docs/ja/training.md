# 学習パラメータ

`MELON()` 関数は、学習の挙動を制御するための多数のパラメータを受け取ります。

## 主要パラメータ

| パラメータ | デフォルト | 説明 |
|-----------|---------|-------------|
| `epochs` | `100` | 学習エポック数 |
| `embed_dim` | `128` | 潜在埋め込みの次元数 |
| `batch_size` | `2048` | 学習バッチサイズ |
| `learning_rate` | `1e-3` | AdamW の学習率 |
| `weight_decay` | `1e-5` | AdamW の weight decay |
| `temperature` | `0.1` | 対比損失の温度 |

## 空間アテンション

| パラメータ | デフォルト | 説明 |
|-----------|---------|-------------|
| `use_spatial_attention` | `True` | NeighborhoodGAT のアテンションバイアスを有効化 |
| `neighbor_k` | `16` | kNN グラフでの最近傍数 |
| `gat_hidden` | `64` | GAT の隠れ次元 |
| `gat_heads` | `8` | GAT のアテンションヘッド数 |
| `gat_dropout` | `0.1` | GAT 内の dropout 率 |

## 融合方式

| パラメータ | デフォルト | 説明 |
|-----------|---------|-------------|
| `fusion` | `"concat"` | 融合方式：`"concat"` または `"x-attn"` |
| `fusion_heads` | `8` | 融合 transformer のアテンションヘッド数 |
| `fusion_layers` | `1` | transformer の層数 |
| `spot_tokenization` | `True` | 各 spot を 1 トークンとして扱う |

:::{warning}
クロスアテンション融合 (`"x-attn"`) は空間アテンションマスクと spot tokenization をサポートしません。
`fusion="x-attn"` のときはこれらは自動的に無効化されます。
:::

## データ拡張の設定

| パラメータ | デフォルト | 説明 |
|-----------|---------|-------------|
| `augmentations` | `("gaussian_noise", "feature_dropout", "neighbor_mix")` | 拡張の種類 |
| `augment_p` | `0.8` | 各拡張の適用確率 |
| `augment_random_choice` | `False` | `True` の場合、各 view ごとにランダムに 1 つの拡張を選ぶ |

利用可能な拡張：
- `gaussian_noise` —— N(0, 0.05) のノイズを加算
- `feature_dropout` —— 特徴量の 20% をゼロに
- `spot_dropout` —— spot の 10% をゼロに
- `scaled_perturb` —— 強度のランダムスケーリング
- `neighbor_mix` —— 空間近傍との mixup
- `simclr` —— 複合：ノイズ + feature dropout

評価時に拡張を無効化する：

```python
model, *_ = MELON(mod1_df, mod2_df, coords_path, augmentations=())
```

## 完全な例

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
