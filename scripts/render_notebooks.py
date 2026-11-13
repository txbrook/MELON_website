"""Render the canonical MELON notebooks for Sphinx without executing cells."""
import argparse
import base64
import json
from pathlib import Path
import re
import shutil

NOTEBOOKS = [
    ("mouse_e15_brain", "example_mouse_e15", ("Mouse E15.5 brain", "小鼠 E15.5 大脑", "マウス E15.5 脳")),
    ("human_tonsil", "human_tonsil", ("Human tonsil", "人扁桃体", "ヒト扁桃")),
    ("mouse_brain", "mouse_brain", ("Five-modality mouse brain", "五模态小鼠大脑", "5 モダリティのマウス脳")),
    ("human_lymph_node", "human_lymph_node", ("Human lymph node", "人淋巴结", "ヒトリンパ節")),
    ("mouse_e13_embryo", "mouse_e13_embryo", ("Mouse E13 embryo", "小鼠 E13 胚胎", "マウス E13 胚")),
    ("controlled_simulation", "controlled_simulation", ("Controlled simulation", "受控模拟", "制御シミュレーション")),
]

HEADINGS = {
    "Imports and data directory": ("Setup", "环境与数据路径", "環境とデータパス"),
    "Input data": ("Input data", "输入数据", "入力データ"),
    "Preprocessed inputs": ("Preprocessed inputs", "预处理输入", "前処理済み入力"),
    "Multimodal inputs": ("Multimodal inputs", "多模态输入", "マルチモーダル入力"),
    "Parameters": ("Parameters", "参数", "パラメータ"),
    "Spatial graph and augmented views": ("Spatial graph and augmentation", "空间图与数据增强", "空間グラフとデータ拡張"),
    "MELON model": ("MELON model", "MELON 模型", "MELON モデル"),
    "Train and embed": ("Training and embedding", "训练与 embedding", "学習と埋め込み"),
    "Spatial clustering": ("Spatial clustering", "空间聚类", "空間クラスタリング"),
    "Spatial plot": ("Spatial domains", "空间分区", "空間ドメイン"),
    "UMAP coordinates and colors": ("UMAP coordinates", "UMAP 坐标", "UMAP 座標"),
    "UMAP": ("UMAP", "UMAP", "UMAP"),
    "Gene expression inputs": ("Gene expression inputs", "基因表达输入", "遺伝子発現の入力"),
    "Marker expression": ("Marker expression", "Marker 基因表达", "マーカー遺伝子発現"),
    "Differential expression": ("Differential expression", "差异表达", "差次的発現解析"),
    "Pathway enrichment": ("Pathway enrichment", "通路富集分析", "パスウェイ濃縮解析"),
    "Domain enrichment": ("Domain enrichment", "空间域富集结果", "ドメイン別の濃縮結果"),
    "Embedding layout and spatial adjacency": ("Embedding layout and spatial adjacency", "Embedding 布局与空间邻接", "埋め込み配置と空間隣接"),
    "MELON domains and adjacency": ("MELON domains and adjacency", "MELON 空间域与邻接网络", "MELON ドメインと隣接ネットワーク"),
    "Decoder inputs and parameters": ("Decoder inputs and parameters", "Decoder 输入与参数", "デコーダーの入力とパラメータ"),
    "Fit the pair decoder": ("Pair decoder", "基因–peak decoder", "遺伝子–ピークデコーダー"),
    "External reference validation": ("External reference validation", "外部参考验证", "外部参照による検証"),
    "MELON ROC curves": ("MELON ROC curves", "MELON ROC 曲线", "MELON ROC 曲線"),
    "Gene-peak activity": ("Gene–peak activity", "基因–peak 活性", "遺伝子–ピーク活性"),
    "Spatial gene-peak activity": ("Spatial gene–peak activity", "基因–peak 活性空间图", "遺伝子–ピーク活性の空間分布"),
    "Paired modalities and prediction targets": ("Paired modalities and targets", "配对模态与预测目标", "ペアのモダリティと予測対象"),
    "Train MELON for each seed": ("MELON training", "MELON 训练", "MELON の学習"),
    "Five-fold target prediction": ("Five-fold target prediction", "五折交叉验证", "5 分割交差検証"),
    "Prediction performance": ("Prediction performance", "预测表现", "予測性能"),
}

def as_text(value):
    return "".join(value) if isinstance(value, list) else value

def fenced(value, language):
    longest = max((len(match.group()) for match in re.finditer(r"`+", value)), default=0)
    fence = "`" * max(3, longest + 1)
    return f"{fence}{language}\n{value.rstrip()}\n{fence}\n"

def render(root, docs, ref):
    generated = docs / "_generated"
    images = docs / "_static/notebooks"
    downloads = docs / "_notebooks"
    for folder in [generated, images, downloads]:
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)
    total_images = 0
    for name, slug, titles in NOTEBOOKS:
        path = root / "Reproduce" / name / "analysis.ipynb"
        raw = path.read_bytes()
        notebook = json.loads(raw)
        (downloads / f"{name}.ipynb").write_bytes(raw)
        output_images = {}
        for i, cell in enumerate(notebook["cells"]):
            for j, output in enumerate(cell.get("outputs", [])):
                if output["output_type"] == "error":
                    raise ValueError(f"{name}: error output in cell {i}")
                image = output.get("data", {}).get("image/png")
                if image:
                    png = base64.b64decode(as_text(image), validate=True)
                    if not png.startswith(b"\x89PNG\r\n\x1a\n"):
                        raise ValueError(f"{name}: invalid PNG in cell {i}")
                    filename = f"{name}-{i}-{j}.png"
                    (images / filename).write_bytes(png)
                    output_images[(i, j)] = filename
                    total_images += 1
        for language, language_index in [("en", 0), ("zh", 1), ("ja", 2)]:
            folder = generated / language
            folder.mkdir(exist_ok=True)
            sections = [f"# {titles[language_index]}\n"]
            for i, cell in enumerate(notebook["cells"]):
                source = as_text(cell.get("source", ""))
                if cell["cell_type"] == "markdown":
                    sections.append(source)
                    continue
                if not source.strip():
                    continue
                comment = source.splitlines()[0].removeprefix("# ")
                heading = HEADINGS.get(comment, (comment,) * 3)[language_index]
                sections += [f"({language}-{name}-cell-{i})=\n## {heading}\n", fenced(source, "python")]
                for j, output in enumerate(cell.get("outputs", [])):
                    data = output.get("data", {})
                    if (i, j) in output_images:
                        filename = output_images[(i, j)]
                        sections.append(f"```{{image}} /_static/notebooks/{filename}\n:alt: {titles[language_index]} — {heading}\n:width: 100%\n:class: notebook-output dark-light\n```\n")
                    elif "text/plain" in data:
                        sections.append(fenced(as_text(data["text/plain"]), "text"))
                    elif output["output_type"] == "stream":
                        sections.append(fenced(as_text(output.get("text", "")), "text"))
            (folder / f"{name}.md").write_text("\n".join(sections))
    print(f"Rendered {len(NOTEBOOKS)} notebooks in 3 languages with {total_images} original PNG outputs; no cells executed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--notebook-root", type=Path, required=True)
    parser.add_argument("--ref", required=True)
    args = parser.parse_args()
    if not re.fullmatch(r"[0-9a-f]{40}", args.ref):
        parser.error("--ref must be a full commit SHA")
    render(args.notebook_root, Path(__file__).resolve().parents[1] / "docs", args.ref)
