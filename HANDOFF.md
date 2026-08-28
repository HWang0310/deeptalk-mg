# Handoff History

## 2026-08-27 — Project creation and approved V2 direction

- Created an independent repository for MG Quality V2 R&D.
- DeepTalk Core was inspected only at `agent/multi-asset-studio` commit `475c144c8dd7696a5ccb49604ada6c4fa4542857`; no Core file was changed.
- Product/Architecture Review approved Remotion-first rendering, an independent MG core design system, extendable profiles and scene grammars, and restrained Chinese editorial design as the first profile hypothesis.
- V0 evidence must compare Legacy baseline with the V2 profile across eight stable Chinese benchmark scene types.

## 2026-08-27 — V0 rendered evidence

- Implemented standalone TypeScript/Remotion source, eight `mg-scene/1` benchmark definitions, editorial profile tokens, bounded Chinese copy fitting, and eight scene grammars.
- First render created eight local MP4s, 24 phase stills, eight contact sheets, manifests, and `qa.json` files under gitignored `output/`.
- Machine QA passed all eight: 1920×1080, 30fps, 8.000s video stream, three stills, and SHA-256.
- A second unchanged render produced matching SHA-256 values for all eight MP4s.
- Human review found hierarchy and progressive disclosure promising, while repeated headline/rule composition and weaker cycle/relationship/abstract grammars remain V0 limitations.
- QA was fixed to inspect video-stream duration rather than a trailing silent audio stream, and to ignore non-directory overview media in `output/`; both cases have regression coverage.
- DeepTalk Core remains unmodified.
- During V0.1 repeat verification, native Chrome GL produced differing pixels for `multi-node`; isolated SwiftShader renders matched SHA-256 exactly. The canonical render script now selects `--gl=swiftshader`; a full-suite rerun under that backend remains an explicit follow-up verification item.

## 2026-08-27 — V0.1 Quality Differentiation

- Preserved all eight V0 benchmark scene definitions and locally snapshotted V0 evidence before rendering V0.1.
- Causal now uses pressure propagation and accumulated consequence; cycle uses an explicit return path; relationship uses weighted influence links and a central actor; abstract uses surface/threshold/underlying layers.
- Added composition anchor rules to avoid random variation while reducing repeated top-left-title framing.
- Added eight-category adversarial typography suite. Long unreadable display copy and extreme labels fail closed; fitting cases preserve every source character.
- V0/V0.1 side-by-side evidence and review are local under `evidence/v0-v0.1-comparison/`.
- No user aesthetic choice was required. V0.1 passes the quality-differentiation R&D gate with stated limitations.
- DeepTalk Core remains unmodified.
# V0.2 reconciliation — 2026-08-28

- V0 = initial editorial-cn-v1 grammar baseline; V0.1 = differentiation of causal/cycle/relationship/abstract; V0.2 = robustness within those grammar families.
- Run A: `output/variants`; run B: `output/variants-run-b`; repeatability snapshots: `evidence/v0.2-repeatability` (local/gitignored).
- Fixed path: SwiftShader, concurrency 1, H.264, 1920x1080, 30fps, 7 seconds. Run A and B: 18/18 MP4 SHA-256 digest match; both media QA passes.
- Human-review outcome is PASS after moving semantic overlays into the first disclosure window. Do not advance to V0.3 or Cross-Plugin trial without Product Review.
