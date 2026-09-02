# DeepTalk MG — Canonical Project State

> Current operational truth. GitHub remote and exact reviewed SHAs override chat or local workspace claims.

## Identity

| Field | Current truth |
| --- | --- |
| Repository | `HWang0310/deeptalk-mg` |
| Stable branch | `main` |
| Runtime behavior baseline | `7ae59f1115da8a011113c81f31d320783b0ce8a4` |
| Stage | Contract V1 runner `ACCEPTED / IMPLEMENTED_UNRELEASED`; plugin quality optimization is the next product track |
| Plugin identity | `org.deeptalk.mg` |
| Canonical runner | `node scripts/contract-runner.js` |
| Product boundary | Independent MG plugin; DeepTalk Core is a separate consumer and may repin only after Nexus integration review |
| Renderer decision | Remotion-first, local 1920×1080 at 30fps |
| Primary visual hypothesis | Restrained Chinese editorial/financial profile with progressive disclosure |

## Governance

- `main` represents the latest plugin-local accepted stable runtime plus governance-only updates.
- New engineering work starts from `main` on an isolated task branch and follows the current `HWang0310/engineering-journal` standards.
- `AGENTS.md` defines the required bootstrap and project-specific rules.
- `docs/DEEPTALK-INTEGRATION.md` is the non-negotiable DeepTalk compatibility gate.
- Plugin-local quality acceptance never updates DeepTalk Core automatically. The plugin returns an exact SHA to DeepTalk Nexus for an independent integration review.

## What has been evidenced

- Standalone deterministic local Remotion rendering without a Core runtime import or API key.
- Structured input to real MG media through `mg-scene/1`.
- Contract V1 suitability/generation runner behavior at the runtime baseline.
- Repeatability evidence from fixed renderer inputs and dependency lock.
- Machine QA for dimensions, video-stream duration, phase stills, and artifact SHA checks.
- Human visual review on the benchmark corpus.
- Typography adversarial coverage including fail-closed cases.
- DeepTalk Phase 5 synthetic integration with the exact-pinned runner.
- A limited real-A-roll Phase 6 owner demo showed MG can produce a useful causal/mechanism candidate and exposed the next quality problem: reduce presentation-card feeling while improving hierarchy, motion rhythm, and video-native composition.

## Current best prototype

`editorial-cn-v1` renders the benchmark through independent `mg-scene/1` inputs and differentiated Remotion grammars. Causal, cycle, relationship, and abstract scenes have distinct composition anchors and meaning-bound motion structures. The Contract V1 runner dynamically maps supported opportunities into the existing rendering system instead of importing Core internals.

## Known limitations / quality targets

- Information density can be too high for short viewing windows.
- Repeated rule/headline/card structures can create presentation-template feeling.
- Relationship, cycle, causal, and abstract grammars need stronger spatial and motion differentiation.
- Progressive disclosure, typography, hierarchy, easing, transitions, and rhythm need creator-facing refinement.
- Cross-machine Chinese font reproducibility remains an operational concern.
- The plugin should prefer `ABSTAIN` over visually polished filler when a semantic opportunity is not a useful MG fit.

## Current next gate

Start an independent MG quality-optimization Curator session from repository Recovery Issue #1. The plugin project may improve renderer internals and visual language, but completion requires native validation, representative before/after visual evidence, Contract V1 compatibility, and a handback exact SHA for DeepTalk Nexus integration review.
