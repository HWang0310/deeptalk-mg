# V0 Human Visual Review

**Evidence inspected:** `output/benchmark-overview.png`, eight three-frame contact sheets, eight MP4 files, and eight `qa.json` records rendered on 2026-08-27. Generated media is intentionally local and gitignored.

Scores use the 1–5 rubric in `docs/QUALITY.md`.

| Benchmark | Composition | Chinese type | Hierarchy | Disclosure | Grammar fit | Rhythm | Art direction / template feeling | Finding |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| core judgment | 4 | 4 | 5 | 4 | 4 | 4 | 3 | Strongest primary statement; supporting line arrives cleanly. |
| causal chain | 4 | 4 | 4 | 4 | 4 | 4 | 3 | Directional list establishes causality, but remains typographic rather than spatial. |
| process/cycle | 3 | 4 | 4 | 3 | 3 | 3 | 3 | The cycle ring distinguishes the task, yet stage progression needs more editorial specificity. |
| comparison | 4 | 4 | 4 | 4 | 4 | 4 | 3 | Paired panels maintain a common comparison basis and readable density. |
| numeric change | 4 | 4 | 5 | 4 | 4 | 4 | 3 | The delta is visually dominant; supporting action stays subordinate. |
| multi-node | 3 | 4 | 4 | 4 | 3 | 3 | 3 | Clear ownership labels, but the relation lines need a more expressive flow grammar. |
| timeline | 4 | 4 | 4 | 4 | 4 | 4 | 3 | Ordered markers are readable and reveal progressively. |
| abstract explanation | 3 | 4 | 4 | 3 | 3 | 3 | 3 | Layered ring is a useful starting metaphor but needs richer semantic variation. |

## Observed improvement over Legacy baseline

- Every scene exposes the core judgment before support; this directly tests the 《牛来》 core-window hypothesis.
- The neutral-paper/ink palette, generous fixed safe area, and semantic data/display roles create a more editorial baseline than Legacy's default dark canvas/card presentation.
- Benchmark kinds now map to eight explicit grammars rather than relying on a small set of legacy payload layouts.
- Copy is bounded before render; no visual text in this suite is clipped or silently abbreviated.

## Remaining limitations

- The V0 visual identity is still overly unified by the repeated top-left rule and large centered headline. It reduces random template swapping, but has not yet eliminated template feeling.
- Causal, multi-node, cycle, and abstract scenes need more distinctive spatial/motion vocabulary.
- This review assesses a small synthetic benchmark suite, not viewer comprehension, editor usage, or real-episode performance.
- Chinese system-font availability was verified visually on this Mac only; cross-machine font reproducibility has not been tested.

## Verdict

The evidence supports continuing the V2 direction. The next R&D cycle should strengthen grammar-specific composition and motion while preserving the confirmed progressive-disclosure hierarchy; it should not add a global high-impact style yet.

