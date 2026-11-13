# Parameters

Each notebook contains its own settings. The E15 configuration is:

```python
config = {
    "epochs": 100,
    "batch_size": 2048,
    "embed_dim": 128,
    "training_seed": 42,
    "learning_rate": 0.001,
    "weight_decay": 1e-5,
    "temperature": 0.1,
    "training_spatial_k": 16,
    "export_spatial_k": 16,
    "augment_p": 0.8,
    "augmentations": ["gaussian_noise", "feature_dropout", "neighbor_mix"],
    "shuffle_batches": False,
    "clustering_seed": 2025,
    "target_clusters": 12,
    "clustering_neighbors": 10,
    "leiden_resolution": 1.0,
}
```

Edit `training_spatial_k`, `augment_p`, `epochs` or `target_clusters` in the relevant notebook. The five-modality brain and controlled simulation use their own configurations.
