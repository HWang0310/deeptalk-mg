# DeepTalk MG Legacy Baseline Audit

**Reference boundary:** read-only inspection of `/Users/hwang/Movies/Codex工作空间/deep-talk-studio`, canonical branch `agent/multi-asset-studio`, HEAD `475c144c8dd7696a5ccb49604ada6c4fa4542857` on 2026-08-27. No Core change was made.

## Evidence inspected

- Visual decision: `src/deeptalk_studio/visual_director.py`.
- Input contract: `src/deeptalk_studio/motion_spec.py` (`motion-spec/1`).
- Asset packaging: `src/deeptalk_studio/asset_pack_workflow.py`.
- Production constraints and QA: `docs/PRODUCTION_CONTRACT.md`, `docs/REMOTION_ADAPTER.md`, `docs/PRODUCTION_EVALS.md`.
- Remotion adapter: `src/deeptalk_studio/production_renderers/remotion.py`.
- Remotion implementation: `renderer_templates/remotion/src/ProductionComposition.tsx`, `Root.tsx`, `index.css`.
- Tests, real production manifests, `PROJECT_STATE.md`, `HANDOFF.md`, and `CHANGELOG.md`.

## Legacy input and scene model

DeepTalk creates an alignment-bound Visual Director plan, then a `motion-spec/1`. It uses real A-roll time spans, semantic beats, visual intent, elements, reveal order, protected regions, and display-text bindings. `motion-spec/1` provides five motion types (`timeline`, `causal_chain`, `comparison_mechanism`, `svg_path_drawing`, `controlled_conceptual_metaphor`) with type-specific element capacity. Its production layer then converts safe reviewed material into `scene_payload` content.

The renderer's actual primary payloads are `timeline`, `bar`, `comparison`, `diagram`, image pan/zoom, and A-roll placeholder. Python owns payload data and grounding; Remotion owns frame-driven presentation.

## Rendering and engineering baseline

Remotion 4.0.507 renders fixed 1920×1080, 30fps compositions locally. The adapter installs dependencies, runs lint/typecheck/composition checks, renders with single concurrency and an installed local browser, and records typed checks. Artifact QA verifies decodability, dimensions, FPS, duration, size, SHA-256, source bindings, and plan digest. This is viable deterministic engineering worth inheriting conceptually, but not copying wholesale.

## Existing visual language

- Timeline: title + central baseline + sequential markers.
- Bar: title + shared baseline + left-to-right bar growth.
- Comparison: title + equal cards with a top accent rule.
- Diagram: title + fixed node grid + later edges and label plates.

Motion is predominantly opacity/translation/scale/line growth with repeated cubic ease-out or cubic in-out windows. The rough preview sequences scenes directly; a reusable scene-to-scene transition grammar is not present.

## Evidence from 《牛来》

Three MG assets were actually used at the correct semantic points, all full screen and shortened by the creator. The most effective one was the date/screening/box-office-turning-point sequence. Two semantically correct assets retained only their core information windows. This supports a hypothesis that primary judgment and core evidence must arrive earlier than complete semantic disclosure. It is one episode only and does not establish global density rules.

## Strengths to preserve

- Deterministic local rendering and no API-key dependency.
- Structured, versioned machine input and output lineage.
- Frame-driven animation rather than CSS timing.
- Conservative capacity limits and integrity/media QA.
- Strong separation between semantic safety and renderer implementation.

## Quality constraints to address

| Area | Evidence | V2 response |
| --- | --- | --- |
| Composition | Fixed, full-canvas layouts repeat across grammars. | Grid, safe regions, focal zones, and explicit primary/supporting hierarchy. |
| Chinese typography | Inline fonts/sizes and overflow hiding; no independent text-fitting system. | Role-based typography, deterministic wrapping, capacity guard, visible failure. |
| Information density | Existing capacity is structural, but display often presents multiple cards/nodes together. | Progressive disclosure phases and per-role density budgets. |
| Motion grammar | Similar cubic reveal mechanics across visual types. | Meaning-bound motion primitives and profile motion tokens. |
| Transitions | Scene sequence has no durable transition system. | Short editorial transitions that preserve visual focus and never delay the judgment. |
| Art direction/template feeling | A shared title/accent/card language dominates. | Profile-level tokens and grammar variants without copy-pasted template layouts. |

## What is not carried forward

- DeepTalk's A-roll alignment bindings, material/research safety model, Asset Pack, Edit Map, Candidate Portfolio concepts, and Episode production path.
- A one-decision-per-span product model.
- A requirement to preserve Legacy payload names or schemas.

