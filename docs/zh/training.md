# 参数

每个 notebook 都有自己的配置。E15 使用以下参数：

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

在相应 notebook 中修改 `training_spatial_k`、`augment_p`、`epochs` 或 `target_clusters`。五模态大脑和受控模拟使用各自的配置。
