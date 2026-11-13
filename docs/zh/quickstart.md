# 安装与使用

使用 Python 3.12。

```bash
git clone https://github.com/txbrook/MELON.git
cd MELON
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[tutorials]" jupyterlab umap-learn requests
```

将 `Published_Data_non_NASH` 放在克隆的 MELON 目录中，或用 `MELON_PUBLISHED_DATA` 指定路径。各 notebook 直接读取模态文件，并包含所需的归一化或 LSI 步骤。

```text
MELON/
├── Reproduce/
└── Published_Data_non_NASH/
```

打开 notebook，直接修改其中的参数字典。

```bash
jupyter lab Reproduce
```

## Notebooks

- {doc}`小鼠 E15.5 大脑 <example_mouse_e15>`
- {doc}`人扁桃体 <human_tonsil>`
- {doc}`五模态小鼠大脑 <mouse_brain>`
- {doc}`人淋巴结 <human_lymph_node>`
- {doc}`小鼠 E13 胚胎 <mouse_e13_embryo>`
- {doc}`受控模拟 <controlled_simulation>`
