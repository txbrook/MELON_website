# Training Configuration

The `MELON()` function accepts many parameters to control training behavior.

## Core Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `epochs` | `100` | Number of training epochs |
| `embed_dim` | `128` | Latent embedding dimension |
| `batch_size` | `2048` | Training batch size |
| `learning_rate` | `1e-3` | AdamW learning rate |
| `weight_decay` | `1e-5` | AdamW weight decay |
| `temperature` | `0.1` | Contrastive loss temperature |

## Spatial Attention

| Parameter | Default | Description |
|-----------|---------|-------------|
| `use_spatial_attention` | `True` | Enable NeighborhoodGAT attention biasing |
| `neighbor_k` | `16` | Number of nearest neighbors in kNN graph |
| `gat_hidden` | `64` | Hidden dimension of the GAT |
| `gat_heads` | `8` | Number of GAT attention heads |
| `gat_dropout` | `0.1` | Dropout rate in GAT |

## Fusion Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `fusion` | `"concat"` | Fusion strategy: `"concat"` or `"x-attn"` |
| `fusion_heads` | `8` | Number of attention heads in fusion transformer |
| `fusion_layers` | `1` | Number of transformer layers |
| `spot_tokenization` | `True` | Treat each spot as a token |

:::{warning}
Cross-attention fusion (`"x-attn"`) does not support spatial attention masks or
spot tokenization. These are automatically disabled when `fusion="x-attn"`.
:::

## Augmentation Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| `augmentations` | `("gaussian_noise", "feature_dropout", "neighbor_mix")` | Augmentation types |
| `augment_p` | `0.8` | Probability of applying each augmentation |
| `augment_random_choice` | `False` | If `True`, randomly pick one augmentation per view |

Available augmentations:
- `gaussian_noise` — Adds N(0, 0.05) noise
- `feature_dropout` — Zeros 20% of features
- `spot_dropout` — Zeros 10% of spots
- `scaled_perturb` — Random intensity scaling
- `neighbor_mix` — Mixup with spatial neighbors
- `simclr` — Composite: noise + feature dropout

To disable augmentations for evaluation:

```python
model, *_ = MELON(mod1_df, mod2_df, coords_path, augmentations=())
```

## Full Example

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
