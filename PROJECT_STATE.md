# DeepTalk MG — Canonical Project State

> Current truth as of 2026-08-27. This project is independent from DeepTalk Core.

## Identity

| Field | Current truth |
| --- | --- |
| Repository | `HWang0310/deeptalk-mg` |
| Branch | `main` |
| Stage | V0 R&D prototype, rendered and verified |
| Product boundary | Deterministic, local MG asset research; no DeepTalk integration or shared plugin contract |
| Renderer decision | Remotion-first, local 1920×1080 at 30fps |
| Primary visual hypothesis | Restrained Chinese editorial/financial profile with progressive disclosure |

## What has been evidenced

- DeepTalk Legacy uses viable deterministic Remotion rendering, structured scene payloads, and artifact-integrity QA.
- Legacy's four primary grammars are timeline, bar, comparison cards, and node diagrams.
- 《牛来》 validated semantic correctness and usefulness of MG, while showing that core-information windows can matter more than full semantic spans.
- Legacy's likely quality constraints are composition, Chinese typography, hierarchy, limited grammar combinations, uniform easing, transitions, information density, and template feeling.

## Current best prototype

`editorial-cn-v1` renders eight deterministic Chinese benchmark scenes through independent `mg-scene/1` inputs and Remotion scene grammars. Each scene has a local MP4, opening/primary/full stills, contact sheet, manifest, and machine QA result. A second unchanged render produced matching SHA-256 hashes for all eight MP4 files.

## Verified in V0

- Standalone local render: yes; no DeepTalk runtime import or API key.
- Structured input to real MG asset: yes, through `mg-scene/1`.
- Repeatability: yes, two render runs produced matching MP4 SHA-256 values.
- Machine QA: yes, all eight outputs pass dimensions, 30fps video-stream duration, phase-still, and SHA checks.
- Human review: completed; see `docs/reviews/2026-08-27-v0-human-visual-review.md`.

## Not yet evidenced

- Whether the V2 system improves real creator/editor outcomes rather than the current synthetic benchmark.
- Whether the typography fitter works across production-length Chinese copy.
- Whether a high-impact local grammar is needed for any benchmark.
- Real-episode integration, a shared plugin contract, and production-level visual selection.

## Known limitations

- The default profile is visually consistent but its repeated top-left rule and headline placement still create template feeling.
- Relationship, cycle, causal, and abstract grammars need more distinctive spatial and motion composition.
- Cross-machine Chinese font reproducibility and real-episode effectiveness remain unverified.

## Next gate

Design and benchmark stronger grammar-specific V0.1 compositions while preserving progressive disclosure. Do not define a cross-plugin contract or integrate with DeepTalk Core.
