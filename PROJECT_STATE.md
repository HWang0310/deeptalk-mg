# DeepTalk MG — Canonical Project State

> Current truth as of 2026-08-27. This project is independent from DeepTalk Core.

## Identity

| Field | Current truth |
| --- | --- |
| Repository | `HWang0310/deeptalk-mg` |
| Branch | `main` |
| Stage | V0.1 Quality Differentiation, rendered and verified |
| Product boundary | Deterministic, local MG asset research; no DeepTalk integration or shared plugin contract |
| Renderer decision | Remotion-first, local 1920×1080 at 30fps |
| Primary visual hypothesis | Restrained Chinese editorial/financial profile with progressive disclosure |

## What has been evidenced

- DeepTalk Legacy uses viable deterministic Remotion rendering, structured scene payloads, and artifact-integrity QA.
- Legacy's four primary grammars are timeline, bar, comparison cards, and node diagrams.
- 《牛来》 validated semantic correctness and usefulness of MG, while showing that core-information windows can matter more than full semantic spans.
- Legacy's likely quality constraints are composition, Chinese typography, hierarchy, limited grammar combinations, uniform easing, transitions, information density, and template feeling.

## Current best prototype

`editorial-cn-v1` renders the unchanged eight-scene benchmark through independent `mg-scene/1` inputs and differentiated Remotion grammars. Causal, cycle, relationship, and abstract scenes now have distinct composition anchors and meaning-bound motion structures. Each scene has local MP4, opening/primary/full stills, contact sheet, manifest, and machine QA result.

## Verified in V0 and V0.1

- Standalone local render: yes; no DeepTalk runtime import or API key.
- Structured input to real MG asset: yes, through `mg-scene/1`.
- Repeatability: yes, two render runs produced matching MP4 SHA-256 values.
- Machine QA: yes, all eight outputs pass dimensions, 30fps video-stream duration, phase-still, and SHA checks.
- Human review: completed; see `docs/reviews/2026-08-27-v0-human-visual-review.md`.
- V0/V0.1 comparison: completed from the same eight definitions; see `docs/reviews/2026-08-27-v0.1-quality-differentiation-review.md`.
- Typography adversarial suite: eight required categories plus intentional fail-closed cases are covered by automated tests.

## Not yet evidenced

- Whether the V2 system improves real creator/editor outcomes rather than the current synthetic benchmark.
- Whether the typography fitter works across production-length Chinese copy.
- Whether a high-impact local grammar is needed for any benchmark.
- Real-episode integration, a shared plugin contract, and production-level visual selection.

## Known limitations

- The default profile is visually consistent but its repeated top-left rule and headline placement still create template feeling.
- Relationship, cycle, causal, and abstract grammars need more distinctive spatial and motion composition.
- Cross-machine Chinese font reproducibility and real-episode effectiveness remain unverified.
- Causal branching/delay, positive/negative feedback, relationship tension, and bottleneck/constraint abstract variants remain unverified.
- Native Chrome GL produced one unstable `multi-node` render at the pixel level. The renderer is now configured for SwiftShader; isolated repeated relationship renders matched SHA, while a full-suite SwiftShader regeneration remains future verification work.

## V0.2 Final Status

**PARTIAL / NEEDS_REWORK.** The 18-scene corpus has passed two fixed-SwiftShader H.264 renders with 18/18 binary-identical MP4 SHA-256 values and media QA. However the formal review finds the semantic overlays visible principally in late disclosure frames; at first glance several family members still share too much of their V0.1 base layout. This is evidence, not a PASS claim.

## Next gate

Run V0.2 grammar-depth R&D only after Product Review: strengthen semantic variants within the four differentiated grammars, then consider a narrowly scoped viewer/editor comprehension evaluation. Do not define a cross-plugin contract or integrate with DeepTalk Core.
