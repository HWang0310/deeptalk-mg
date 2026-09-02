# DeepTalk Integration Boundary — MG

## Purpose

This file defines the compatibility gate that every MG optimization must pass before DeepTalk Nexus may repin Core to a new MG exact SHA.

MG is independently developed in this repository. Better visuals are welcome; silent breakage of the DeepTalk plugin boundary is not.

## Current accepted interface

- Plugin identity: `org.deeptalk.mg`
- Contract version: `visual-asset-plugin-contract/1`
- Accepted runtime base: `7ae59f1115da8a011113c81f31d320783b0ce8a4`
- Canonical runner: `node scripts/contract-runner.js`
- DeepTalk compatibility baseline: `HWang0310/deep-talk-studio@db172cecc60ca6b0c276ec42010b113a767bc7b3`

## Non-negotiable compatibility gate

Unless DeepTalk Nexus separately approves a new versioned contract, MG must preserve:

1. independent repository ownership; DeepTalk Core does not import MG internals;
2. `visual-asset-plugin-contract/1` request/result semantics;
3. two-stage `Suitability -> Generation` behavior;
4. completed suitability outcomes `SUITABLE | BORDERLINE | ABSTAIN`;
5. generation operation statuses `COMPLETED | FAILED | BLOCKED | UNAVAILABLE`;
6. produced candidate statuses `READY | QA_REJECTED`;
7. ordinary subprocess/file invocation through the canonical runner;
8. Core-owned request/result/output-directory boundaries;
9. fail-closed validation for malformed/unsafe requests and outputs;
10. no Codex-only, TeleAgent-only, ChatGPT-only, or other single-Agent proprietary runtime prerequisite;
11. no automatic winner selection, overlap resolution, NLE editing, or A-roll modification;
12. explanatory media remains illustration/graphics and does not impersonate evidence or `REAL_MATERIAL`.

If an optimization appears to require breaking this boundary, stop and escalate rather than silently changing it.

## Plugin-local optimization freedom

Within the gate, the MG project may independently evolve:

- Remotion/component internals;
- motion grammar;
- scene composition;
- typography and spacing;
- progressive disclosure;
- easing/transitions/rhythm;
- visual primitives;
- benchmark corpus;
- renderer implementation and QA.

Internal implementation may change substantially as long as the external DeepTalk boundary remains compatible and the resulting media is more useful to creators.

## Required validation before handback

Before a Plugin Curator reports a candidate runtime ready for DeepTalk review:

- project-native tests pass;
- lint/typecheck/build/render/QA checks required by the repository pass;
- canonical runner `--version`, suitability, and generation smoke paths pass;
- the resulting Contract V1 response and artifacts validate against the current Core compatibility baseline;
- no private episode material or machine-specific secrets are committed;
- representative before/after visual evidence is available for Owner review;
- branch and remote exact SHA are available for independent review;
- any change to plugin identity, version, runner command, artifact roles, or status semantics is explicitly declared.

## Handback protocol

Return to DeepTalk Nexus only after plugin-local acceptance:

```text
PLUGIN_OPTIMIZATION_READY
PLUGIN: MG
REPO: HWang0310/deeptalk-mg
BASE_SHA: <starting main SHA>
CANDIDATE_SHA: <full exact SHA>
BRANCH: <task branch>
RUNNER: node scripts/contract-runner.js
CONTRACT_V1_COMPAT: PASS/FAIL
DEEPTALK_CORE_BASE: db172cecc60ca6b0c276ec42010b113a767bc7b3
CORE_INTEGRATION_CHECK: PASS/FAIL
NATIVE_VALIDATION: PASS/FAIL
OWNER_VISUAL_REVIEW: PASS/PENDING
BREAKING_CHANGE: NONE/<brief>
BLOCKER: NONE/<brief>
```

The Plugin Curator may decide that the MG project itself has reached an accepted quality milestone. Only DeepTalk Nexus may update the Core pin after an independent exact-SHA integration review.
