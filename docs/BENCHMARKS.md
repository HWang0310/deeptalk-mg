# MG Quality V2 Benchmarks

Every benchmark is Chinese-first, 16:9, local, API-free, and deterministic. Inputs live as small JSON definitions under `benchmarks/`; generated outputs stay under gitignored `output/`.

| ID | Cognitive task | Visual purpose | Candidate grammar | Primary review point |
| --- | --- | --- | --- | --- |
| core-judgment | 一个核心判断 | 先给结论，再给依据 | editorial thesis | 是否一眼读出判断 |
| causal-chain | 因果链 | 显示触发和传导 | causal flow | 因果方向是否清晰 |
| process-cycle | 流程/循环 | 显示阶段和反馈 | cycle | 是否误读为线性流程 |
| comparison | 对比 | 先建立共同尺度，再比较 | paired contrast | 两方是否平衡且可读 |
| numeric-change | 数字变化 | 突出变化幅度和基线 | delta metric | 数字、单位、增减是否先后清楚 |
| multi-node | 多节点关系 | 展示主体关系而非堆卡片 | relationship map | 关系是否压过节点数量 |
| timeline | 时间推进 | 展示顺序和转折 | editorial timeline | 转折是否可定位 |
| abstract-explanation | 抽象概念解释 | 把抽象机制转为可理解结构 | layered metaphor | 是否避免装饰性抽象 |

For every benchmark, the required artifacts are: an input definition, MP4, three still frames (opening, primary judgment, fully disclosed), contact sheet, render manifest, QA JSON, and a human-review row.

