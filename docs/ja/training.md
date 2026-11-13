# パラメータ

各 notebook に設定を記載しています。E15 の設定は次のとおりです。

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

対象の notebook 内で `training_spatial_k`、`augment_p`、`epochs`、`target_clusters` を変更します。5 モダリティの脳と制御シミュレーションには個別の設定があります。
