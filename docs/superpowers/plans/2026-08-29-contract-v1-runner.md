# Visual Asset Plugin Contract V1 Runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a local, deterministic DeepTalk MG Contract V1 runner that dynamically compiles a supported Visual Opportunity to a real `mg-scene/1` Remotion video.

**Architecture:** Keep the Core contract wire-compatible but independently implemented in `src/contract-runner.ts`; the runner validates JSON file input, makes deterministic suitability/proposal decisions, compiles causal opportunities into existing MG scenes, and invokes one stable dynamic Remotion composition. The CLI writes only an atomic result file and artifacts contained by the supplied output root.

**Tech Stack:** TypeScript, Vitest, Remotion 4, FFmpeg/ffprobe, Node standard library.

**Spec:** `/Users/hwang/.codex/attachments/eb28ec12-7d2a-445c-a8c3-57c872bfa061/pasted-text.txt` and read-only Core `docs/plans/2026-08-28-visual-asset-plugin-contract-v1.md`.

## Global Constraints

- Use exactly `visual-asset-plugin-contract/1`, `deeptalk-mg`, and `1.0.0-contract-v1`.
- Accept only local `--request`, `--result`, and explicit `--output-dir`; no network, RPC, daemon, Core import, API key, tag, or release.
- Preserve `mg-scene/1`, `editorial-cn-v1`, current grammars, 1920×1080/30fps, SwiftShader, concurrency 1, fixtures, and benchmark output trees.
- Keep all generated files beneath the caller-supplied output directory and atomically replace the result JSON.
- Unit tests never perform a real render; the dedicated integration command does one sanitized causal request and two fresh-root repeatability runs.

---

### Task 1: Contract models, validation, and deterministic suitability

**Files:**
- Create: `src/contract-runner.ts`
- Create: `tests/contract-runner.test.ts`

**Interfaces:**
- Produces `runContractRequest(request, dependencies)` and `PLUGIN_ID`, `PLUGIN_VERSION`.
- Accepts strict Suitability/Generation V1 request JSON and returns V1 response JSON.

- [x] Write failing tests for version identity, invalid JSON/version/opportunity rejection, causal `SUITABLE`, non-causal `BORDERLINE`/`ABSTAIN`, echo fields, and request-independent deterministic proposal IDs.
- [x] Run `npm test -- tests/contract-runner.test.ts` and confirm each new assertion fails because the runner module does not exist.
- [x] Implement only request validation, suitability classification, canonical hashing, and strict response construction required by those tests.
- [x] Re-run the focused test file until green.
- [x] Commit the red-green contract-model slice.

### Task 2: Dynamic MG compiler and composition boundary

**Files:**
- Modify: `src/Root.tsx`
- Modify: `src/contract-runner.ts`
- Modify: `tests/contract-runner.test.ts`

**Interfaces:**
- `compileOpportunity(opportunity)` returns a validated causal `MgScene` using `causal-flow`.
- `ContractDynamic` is a stable composition ID with dynamic `scene` props.

- [x] Add failing compiler tests proving opportunity text changes rendered scene content and no benchmark ID lookup is used.
- [x] Run the focused tests and observe the compiler export is missing.
- [x] Implement deterministic text extraction and a fixed 7-second causal `mg-scene/1`; register one static `ContractDynamic` Remotion composition using existing `BenchmarkComposition`.
- [x] Re-run focused tests and typecheck.
- [x] Commit the dynamic compilation slice.

### Task 3: CLI, artifact containment, and atomic result protocol

**Files:**
- Create: `scripts/contract-runner.mjs`
- Modify: `src/contract-runner.ts`
- Modify: `package.json`
- Modify: `tests/contract-runner.test.ts`

**Interfaces:**
- `npm run contract:runner -- --version` prints the exact plugin version.
- `npm run contract:runner -- --request <file> --result <file> --output-dir <dir>` writes an atomic result and no normal stdout.

- [x] Write failing child-process tests for `--version`, invalid JSON, proposal mismatch, outside-root refusal, and atomic result replacement.
- [x] Run focused tests and verify the CLI behavior fails.
- [x] Implement argv parsing, safe paths, atomic same-directory result writing, structured legal failures, and generation lineage validation.
- [x] Re-run focused tests and lint/typecheck.
- [x] Commit the protocol slice.

### Task 4: Real renderer, native QA, and contract artifacts

**Files:**
- Modify: `scripts/contract-runner.mjs`
- Modify: `src/contract-runner.ts`
- Modify: `src/qa.ts`
- Modify: `tests/contract-runner.test.ts`

**Interfaces:**
- Generation completion creates exactly one candidate with `scene.mp4`, `manifest.json`, `qa.json`, real SHA/duration, `local-runner://` URIs, `READY`, and generated provenance.

- [x] Write failing unit tests around artifact/result shaping with injected renderer metadata, including candidate ID determinism, placement containment, and QA status behavior.
- [x] Run focused tests and observe missing generation artifact behavior.
- [x] Implement the SwiftShader/concurrency-one Remotion call, ffprobe metadata reading, native QA, manifest/QA writers, and `QA_REJECTED` only for actual QA failures.
- [x] Re-run focused tests and typecheck.
- [x] Commit the real-render slice.

### Task 5: Dedicated integration and repeatability proof

**Files:**
- Create: `scripts/verify-contract-runner.mjs`
- Create: `tests/contract-runner-integration.test.ts`
- Modify: `package.json`

**Interfaces:**
- `npm run verify:contract-runner` drives suitability → generation twice with a sanitized causal opportunity under two new temporary roots and verifies binary-identical MP4 SHA-256.

- [x] Write a skipped-by-default integration test that invokes the verification command only when `MG_RUN_REAL_INTEGRATION=1`.
- [x] Run ordinary `npm test` and verify it does not render.
- [x] Implement the dedicated command using actual CLI calls, ffprobe/sha assertions, V1-shape checks, manifest/QA verification, and output-root confinement checks.
- [x] Run the command, inspect its complete output, then run ordinary tests again.
- [x] Commit verified integration evidence code.

### Task 6: Documentation, regression, review, and remote verification

**Files:**
- Modify: `README.md`, `PROJECT_STATE.md`, `ROADMAP.md`, `CHANGELOG.md`, `HANDOFF.md`

- [x] Record `IMPLEMENTED_UNRELEASED`, review-branch status, local-only contract boundary, no Core integration/acceptance/pin, and documented runner command.
- [x] Run fresh `npm test`, `npm run lint`, `npm run typecheck`, `npm run qa:benchmarks`, and `npm run verify:contract-runner`; inspect each exit code/output.
- [x] Review the final diff against all Contract V1 requirements, commit documentation and remaining code, push `agent/phase3a-contract-v1-runner`, and verify `origin/<branch>` equals local `HEAD`.
