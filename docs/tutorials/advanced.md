# Advanced Topics

## Custom Augmentations

You can pass your own `SpatialOmicsAugmentations` instances:

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

## Fusion Modes

MELON supports two fusion strategies in the `MMFusion` encoder:

### Concatenation (default)

Tokens from all modalities are concatenated along the sequence dimension, then
processed by self-attention layers.

```python
model, *_ = MELON(..., fusion="concat", spot_tokenization=True)
```

### Cross-Attention

Each modality attends to the other via cross-attention blocks, then outputs are
concatenated and mean-pooled.

```python
model, *_ = MELON(..., fusion="x-attn")
```

:::{warning}
Cross-attention does not support spatial attention or spot tokenization.
:::

## Model Architecture Overview

```
Input: mod1_df (N, G), mod2_df (N, P), coords (N, 2)
  |
  v
Encoders: MLP (G -> E), MLP (P -> E)
  |
  v
SpotTokenAdapter: (N, E) -> (1, N, E) per modality
  |
  v
MMFusion / FusionTransformer: concat + self-attention
  |  (optional: NeighborhoodGAT attention bias from coords)
  v
Projection MLP: E -> 256 -> E
  |
  v
MELONLoss: InfoNCE across views and modalities
```
