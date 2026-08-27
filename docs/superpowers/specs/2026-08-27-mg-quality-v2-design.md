# MG Quality V2 Design

## Goal

Build a standalone, deterministic local prototype that renders and evaluates eight Chinese MG benchmark scenes, testing whether a restrained editorial profile improves visual clarity and reduces template feeling relative to the audited Legacy baseline.

## Approved architecture

Use Remotion-first rendering with an independent MG core. The core contains independent scene definitions, design tokens, typography, composition, scene grammars, motion grammars, visual profiles, render orchestration, and QA. It neither imports DeepTalk code nor defines the eventual cross-plugin contract.

## Data model

`mg-scene/1` has a stable scene id, benchmark kind, profile id, grammar id, fixed canvas/FPS/duration, primary judgment, optional supporting facts, and grammar-specific structured data. The validator owns permitted combinations and density limits. A scene definition is intentionally a local R&D interface, not a future DeepTalk interface.

## Design system

- **Tokens:** neutral paper/ink palette, a restrained emphasis color, 8-point spacing scale, editorial grid, safe area, radii, motion durations, and easing curves.
- **Typography:** display/body/data/caption/label roles, Chinese system-font stack, max line count, deterministic wrapping, and minimum font sizes.
- **Composition:** primary judgment occupies a stable focal zone. Support enters later and cannot displace it.
- **Scene grammars:** thesis, causal flow, cycle, paired contrast, delta metric, relationship map, timeline, and layered metaphor.
- **Motion grammars:** reveal, trace, propagate, compare, count/delta, and focus-shift. Each grammar uses motion tied to its cognitive task rather than generic card animation.
- **Profiles:** `editorial-cn-v1` is the default hypothesis. Profiles provide tokens and permitted variants, allowing a future high-impact local profile without renderer duplication.

## Benchmark and evidence

The fixed eight-scene benchmark suite is defined in `docs/BENCHMARKS.md`. Each render yields a deterministic MP4, three phase stills, contact sheet, manifest, QA JSON, and human review row. Two unchanged runs must produce valid artifacts and stable scene definitions; binary MP4 identity is reported but not treated as the only reproducibility criterion because encoder metadata can vary.

## QA boundaries

Machine QA proves structural validity and media integrity. Human review records the qualities pixels cannot reliably score: composition, typography, hierarchy, density, motion meaning, rhythm, art direction, and template feeling. Neither substitutes for the other.

## Constraints

- 1920×1080, 30fps, local execution, no API key, no remote asset.
- Media remains gitignored.
- No modification of DeepTalk Core.
- No Plugin Contract, Candidate Portfolio, Episode work, automatic editing, or release claim.

