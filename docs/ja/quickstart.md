# インストールと使用方法

Python 3.12 を使用します。

```bash
git clone https://github.com/txbrook/MELON.git
cd MELON
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[tutorials]" jupyterlab umap-learn requests
```

`Published_Data_non_NASH` をクローンした MELON ディレクトリに配置するか、`MELON_PUBLISHED_DATA` でパスを指定します。Notebook は前処理済みの入力から始まります。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

Notebook を開き、パラメータ辞書を直接編集します。

```bash
jupyter lab Reproduce
```

## Notebooks

- {doc}`マウス E15.5 脳 <example_mouse_e15>`
- {doc}`ヒト扁桃 <human_tonsil>`
- {doc}`5 モダリティのマウス脳 <mouse_brain>`
- {doc}`ヒトリンパ節 <human_lymph_node>`
- {doc}`マウス E13 胚 <mouse_e13_embryo>`
- {doc}`制御シミュレーション <controlled_simulation>`
