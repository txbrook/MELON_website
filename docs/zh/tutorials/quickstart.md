# 快速开始

让 MELON 在你的机器上跑起来。

## 环境要求

如果还没有安装 [uv](https://docs.astral.sh/uv/getting-started/installation/)，请先安装：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 配置环境

进入 MELON 项目目录，创建虚拟环境：

```bash
cd /path/to/MELON

# 创建虚拟环境
uv venv .venv_uv_melon --python 3.12
source .venv_uv_melon/bin/activate

# 安装核心依赖
uv pip install torch pytorch-lightning numpy pandas scipy h5py scikit-learn einops scanpy

# 以可编辑模式安装 MELON
uv pip install -e .
```

## 验证安装

```bash
melon-run --help
melon-cluster --help
```

## 输入 / 输出

**输入** —— 三个文件：

| 输入 | 格式 | 说明 |
|-------|--------|-------------|
| 模态 1 | `.h5ad` 或 `DataFrame`（spots × features） | 例如：基因表达 |
| 模态 2 | `.h5ad` 或 `DataFrame`（spots × features） | 例如：蛋白 / ATAC |
| 坐标 | `.csv`，列为 `x`、`y`（索引为 barcode） | 空间位置 |

**输出** —— 一个联合嵌入 CSV：

| 输出 | 格式 | 说明 |
|--------|--------|-------------|
| `latent_melon.csv` | `DataFrame`（spots × embed_dim） | 用于后续聚类、可视化等的联合潜在表示 |

## 下一步

接下来请阅读 {doc}`示例：小鼠 E15.5 大脑 (RNA + ATAC) </tutorials/example_mouse_e15>`，
那是一个基于真实数据的完整流程。
