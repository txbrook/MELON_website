# クイックスタート

MELON をあなたのマシンで動かしてみましょう。

## 前提条件

[uv](https://docs.astral.sh/uv/getting-started/installation/) がまだインストールされていない場合は、先にインストールしてください：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 環境のセットアップ

MELON プロジェクトのディレクトリに移動し、仮想環境を作成します：

```bash
cd /path/to/MELON

# 仮想環境を作成
uv venv .venv_uv_melon --python 3.12
source .venv_uv_melon/bin/activate

# 主要な依存パッケージをインストール
uv pip install torch pytorch-lightning numpy pandas scipy h5py scikit-learn einops scanpy

# MELON を editable モードでインストール
uv pip install -e .
```

## インストールの確認

```bash
melon-run --help
melon-cluster --help
```

## 入力 / 出力

**入力** —— 3 つのファイル：

| 入力 | 形式 | 説明 |
|-------|--------|-------------|
| モダリティ 1 | `.h5ad` または `DataFrame`（spots × features） | 例：遺伝子発現 |
| モダリティ 2 | `.h5ad` または `DataFrame`（spots × features） | 例：タンパク質 / ATAC |
| 座標 | `.csv`、列は `x`、`y`（インデックスは barcode） | 空間位置 |

**出力** —— 結合された埋め込みを格納した CSV：

| 出力 | 形式 | 説明 |
|--------|--------|-------------|
| `latent_melon.csv` | `DataFrame`（spots × embed_dim） | 後段のクラスタリングや可視化に使う結合潜在表現 |

## 次のステップ

実データを使った完全なウォークスルーは
{doc}`例：マウス E15.5 脳 (RNA + ATAC) </example_mouse_e15>` をご覧ください。
