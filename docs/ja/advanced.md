# 下流解析

E15 notebook では MELON の埋め込みに続いて、次の解析を行います。

- Col1a1 と Neurod2 の発現空間図とバイオリンプロット。
- 差次的発現解析とドメイン別のパスウェイ濃縮。
- MELON t-SNE と空間ドメインの隣接ネットワーク。
- ペアデコーダーと scHiCAR / Brain2023 の ROC 曲線。
- Myl4 と Neurod2 の遺伝子–ピーク活性の空間分布。

デコーダーは `melon_pkg.decoder` にあります。濃縮解析セルを実行すると g:Profiler に問い合わせます。

{doc}`E15 notebook を開く <example_mouse_e15>`
