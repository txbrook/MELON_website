# 例：マウス E15.5 脳 (RNA + ATAC)

このチュートリアルでは、実データセット
**マウス胎児脳 (E15.5)**（RNA と ATAC-seq のペアデータ）に対して
MELON のワークフロー全体を順を追って実行します。

## データセット概要

| 項目 | 値 |
|----------|-------|
| 組織 | マウス胎児脳 (E15.5) |
| スポット数 | 1,949 |
| モダリティ 1 (RNA) | 2,144 遺伝子 |
| モダリティ 2 (ATAC) | 47,287 peaks（50 次元の LSI 成分に縮約） |
| アノテーション | 12 の脳領域 (diencephalon, cartilage, hindbrain, dpallm, mesenchyme, midbrain, skull, subpallium, muscle, cerebellar vermis, dpallv, thalamus) |

データは `Mouse_E15.5/` 以下に置かれており、次のファイルを含みます：

```
Mouse_E15.5/
├── mRNA_data.h5        # 遺伝子発現 (H5 形式)
├── ATAC_data.h5        # クロマチン accessibility (H5 形式)
├── coords.csv          # 空間座標 (barcode, x, y)
└── truth.csv           # 脳領域の正解アノテーション
```

## ステップ 1：MELON の学習

このワークスペース内で、チュートリアル用の `uv` 環境を有効化済みであるとします：

```bash
source .venv_uv_legacy/bin/activate
```

CLI から MELON を実行します。ATAC モダリティは 47K peaks あるので、
学習前に **TF-IDF + LSI** で 50 次元に縮約します：

```bash
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \    # モダリティ 1：RNA 発現 (H5)
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \    # モダリティ 2：ATAC peaks (H5)
    --coords_csv Mouse_E15.5/coords.csv \   # 空間座標 (barcode, x, y)
    --atac_preprocess tfidf_lsi \           # TF-IDF + LSI で 47K peaks を圧縮
    --output_dir results/example_mouse_e15 \# 埋め込みと成果物の出力先
    --epochs 100 \                          # 学習エポック数
    --seed 42                               # 再現性のための乱数シード
```

:::{note}
`--atac_preprocess tfidf_lsi` フラグを付けると、TF-IDF 正規化のあとに
切断 SVD (LSI) を適用し、高次元の ATAC peak 行列をコンパクトな表現にします。
ATAC-seq データに対する推奨手順です。
:::

## ステップ 2：埋め込みのクラスタリング

学習コマンドは出力ディレクトリに `latent_melon.csv` を書き出します。
この埋め込みを CLI でクラスタリングします。デフォルトのチュートリアル例では
`leiden` を使います：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \   # ステップ 1 の出力先（latent_melon.csv を含む）
    --coords_csv Mouse_E15.5/coords.csv \     # 空間座標 (barcode, x, y)
    --target_k 12 \                           # 期待するクラスタ数
    --methods leiden                          # 使用するクラスタリング手法
```

これにより、次のファイルが生成されます：

```text
results/example_mouse_e15/
├── latent_melon.csv
├── clusters_k12.csv
├── clusters_leiden_k12.csv
└── ...
```

複数のクラスタリング手法を比較したい場合は、次のように実行します：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```

## 結果

このチュートリアル設定（`uv` venv、epochs=100、embed_dim=128、
ATAC は TF-IDF+LSI、seed=42）で得られた MELON の Leiden クラスタは、
空間的にも明確な構造を示し、埋め込み空間でもよく分離されています：

```{image} /_static/mouse_e15_spatial_umap.png
:alt: マウス E15.5 脳 — 空間座標における MELON Leiden クラスタと、MELON 埋め込みの UMAP
:width: 100%
```

左：組織座標上に表示したクラスタ。右：MELON の潜在埋め込みの UMAP を、
同じクラスタラベルで色付けしたもの。

### `--target_k` の選び方

`--target_k` はアルゴリズムに返してほしいクラスタ数です。
自分のデータセットに対しては、ほぼ必ず調整が必要になります —— 唯一の「正解」は存在せず、
最適な値はあなたが関心のある生物学的な解像度に依存します。実用的な指針をいくつか挙げます：

- **事前知識から始める。** 組織領域・細胞種・組織学的ドメインの予想数があるなら、
  それを `--target_k` の初期値にします。このマウス E15.5 の例では、参照アノテーションが
  12 の脳領域を定義しているため `12` を使っています。
- **範囲をスイープする。** 「正解」の数が分からないときは、小さなスイープ
  （例：`8, 10, 12, 15, 20`）を回し、空間プロットと UMAP を並べて比較します。
  クラスタが空間的にまとまっていて、生物学的にも解釈しやすい値を選びます
  （断片化していたり過剰にマージされていない値）。
- **k が小さいほど粗いドメイン、大きいほど細かいサブタイプ。** クラスタが明確な解剖学的
  境界を跨いでにじみ出している場合は k を増やします。逆に、空間的なまとまりのない
  小さなクラスタが多数できる場合は k を減らします。
- **`target_k` は目標値であり、ハードな制約ではない。** Leiden / Louvain のような
  グラフベース手法は resolution を調整して目標値に近づけるため、最終的なクラスタ数は
  `k` に近いがちょうど一致するとは限りません。一方 `kmeans` や `gmm` は厳密に `k` 個を返します。
- **再実行は安価。** `melon-cluster` はキャッシュ済みの `latent_melon.csv` を再クラスタリングする
  だけなので、`--target_k` を変えても MELON を**再学習する必要はありません**。
  数秒で繰り返せます。

例えば、同じ学習済み埋め込みに対してより細かい解像度を試すには：

```bash
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 18 \
    --methods leiden
```

## CLI リファレンス（フル）

```bash
# 学習
melon-run \
    --mod1_h5 Mouse_E15.5/mRNA_data.h5 \
    --mod2_h5 Mouse_E15.5/ATAC_data.h5 \
    --coords_csv Mouse_E15.5/coords.csv \
    --atac_preprocess tfidf_lsi \
    --output_dir results/example_mouse_e15 \
    --epochs 100 \
    --seed 42

# クラスタリング
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods leiden

# オプション：複数のクラスタリング手法を比較
melon-cluster \
    --melon_dir results/example_mouse_e15 \
    --coords_csv Mouse_E15.5/coords.csv \
    --target_k 12 \
    --methods spectral,gmm,kmeans,walktrap,louvain,leiden \
    --primary_method leiden
```
