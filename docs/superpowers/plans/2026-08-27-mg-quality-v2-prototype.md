# MG Quality V2 Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a standalone Remotion-first V0 prototype that renders, validates, and reviews eight deterministic Chinese MG benchmarks.

**Architecture:** TypeScript owns an independent `mg-scene/1` validator, editorial profile tokens, deterministic typography fitting, and small meaning-bound grammar components. Remotion consumes only validated scene objects; Node scripts render fixed evidence and produce machine QA records.

**Tech Stack:** Node.js, TypeScript, React 19, Remotion 4, Vitest, ESLint, ffprobe.

**Spec:** `docs/superpowers/specs/2026-08-27-mg-quality-v2-design.md`

## Global Constraints

- 1920×1080 at 30fps; local rendering; no API key or remote assets.
- Do not import or modify DeepTalk Core.
- Use frame-derived Remotion animation; no CSS animation or nondeterministic random values.
- Generated media and render output remain gitignored under `output/`.
- Every source behavior begins with a watched failing Vitest test.

---

### Task 1: Establish the TypeScript and Remotion test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, `remotion.config.ts`
- Create: `src/index.ts`, `tests/harness.test.ts`

**Interfaces:**
- Produces `npm test`, `npm run lint`, `npm run typecheck`, and a Remotion entry point.

- [ ] **Step 1: Write the failing harness test**

```ts
import {describe, expect, it} from 'vitest';
import {CANVAS} from '../src/model';
it('publishes the fixed benchmark canvas', () => {
  expect(CANVAS).toEqual({width: 1920, height: 1080, fps: 30});
});
```

- [ ] **Step 2: Run the test to verify red**

Run: `npm test -- tests/harness.test.ts`

Expected: failure because `src/model` does not exist.

- [ ] **Step 3: Implement the smallest model export and harness configuration**

```ts
export const CANVAS = {width: 1920, height: 1080, fps: 30} as const;
```

- [ ] **Step 4: Run green checks**

Run: `npm test -- tests/harness.test.ts && npm run lint && npm run typecheck`

Expected: all commands exit zero.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts eslint.config.mjs remotion.config.ts src/index.ts src/model.ts tests/harness.test.ts
git commit -m "chore: establish mg prototype harness"
```

### Task 2: Define and validate `mg-scene/1`

**Files:**
- Create: `src/model.ts`, `src/validate.ts`, `tests/validate.test.ts`

**Interfaces:**
- Produces `type MgScene`, `type BenchmarkKind`, `validateScene(scene: MgScene): MgScene`.
- Consumes `CANVAS` from Task 1.

- [ ] **Step 1: Write failing validator tests**

```ts
expect(() => validateScene({...scene, primaryJudgment: ''})).toThrow('primaryJudgment');
expect(() => validateScene({...scene, grammar: 'unknown'})).toThrow('grammar');
expect(validateScene(scene).sceneVersion).toBe('mg-scene/1');
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/validate.test.ts`

Expected: failure because `validateScene` is not exported.

- [ ] **Step 3: Implement minimal version, kind/profile/grammar validation and bounded arrays**

```ts
export function validateScene(scene: MgScene): MgScene {
  if (!scene.primaryJudgment.trim()) throw new Error('primaryJudgment is required');
  if (!GRAMMARS.includes(scene.grammar)) throw new Error('grammar is not supported');
  return scene;
}
```

- [ ] **Step 4: Verify green**

Run: `npm test -- tests/validate.test.ts`

Expected: all validator cases pass.

- [ ] **Step 5: Commit**

```bash
git add src/model.ts src/validate.ts tests/validate.test.ts
git commit -m "feat: validate independent mg scenes"
```

### Task 3: Implement editorial tokens and Chinese copy fitting

**Files:**
- Create: `src/profiles.ts`, `src/fit.ts`, `tests/fit.test.ts`

**Interfaces:**
- Produces `EDITORIAL_CN_V1`, `fitChineseCopy(text, role): FittedCopy`.
- Consumes valid display text from Task 2.

- [ ] **Step 1: Write failing fit tests**

```ts
expect(fitChineseCopy('核心判断先出现，再补充证据。', 'display').lines).toHaveLength(1);
expect(() => fitChineseCopy('很长'.repeat(80), 'caption')).toThrow('does not fit');
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/fit.test.ts`

Expected: failure because the fitting module does not exist.

- [ ] **Step 3: Implement role capacities and deterministic Chinese character wrapping**

```ts
const ROLE_CAPACITY = {display: [16, 2], body: [22, 3], data: [12, 1], caption: [28, 2], label: [10, 1]} as const;
```

Reject text requiring more than the allowed line count; never truncate it.

- [ ] **Step 4: Verify green**

Run: `npm test -- tests/fit.test.ts`

Expected: valid Chinese copy wraps deterministically and overflow rejects.

- [ ] **Step 5: Commit**

```bash
git add src/profiles.ts src/fit.ts tests/fit.test.ts
git commit -m "feat: add editorial typography fitting"
```

### Task 4: Create eight benchmark definitions

**Files:**
- Create: `benchmarks/scenes.ts`, `tests/benchmarks.test.ts`

**Interfaces:**
- Produces `BENCHMARK_SCENES: readonly MgScene[]`.
- Consumes `validateScene` from Task 2 and editorial profile from Task 3.

- [ ] **Step 1: Write failing benchmark-coverage test**

```ts
expect(BENCHMARK_SCENES.map((scene) => scene.benchmarkKind).sort()).toEqual([
  'abstract-explanation', 'causal-chain', 'comparison', 'core-judgment',
  'multi-node', 'numeric-change', 'process-cycle', 'timeline',
]);
expect(BENCHMARK_SCENES.every(validateScene)).toBe(true);
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/benchmarks.test.ts`

Expected: failure because benchmark definitions do not exist.

- [ ] **Step 3: Add concise Chinese scene objects with fixed ids, grammar ids, duration, and primary/supporting content**

The exact ids are `core-judgment`, `causal-chain`, `process-cycle`, `comparison`, `numeric-change`, `multi-node`, `timeline`, and `abstract-explanation`; all declare `editorial-cn-v1`.

- [ ] **Step 4: Verify green**

Run: `npm test -- tests/benchmarks.test.ts`

Expected: exactly eight valid, uniquely-id scenes.

- [ ] **Step 5: Commit**

```bash
git add benchmarks/scenes.ts tests/benchmarks.test.ts
git commit -m "feat: add deterministic chinese benchmark suite"
```

### Task 5: Implement frame-driven grammar components

**Files:**
- Create: `src/grammars.tsx`, `src/Root.tsx`, `tests/grammars.test.tsx`

**Interfaces:**
- Produces `BenchmarkScene`, one composition for every benchmark, and fixed still compositions.
- Consumes validated `MgScene`, profile tokens, and fitted copy.

- [ ] **Step 1: Write failing render-tree tests**

```tsx
expect(renderToStaticMarkup(<BenchmarkScene scene={BENCHMARK_SCENES[0]} />)).toContain('核心判断');
expect(grammarFor('timeline')).toBeDefined();
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/grammars.test.tsx`

Expected: failure because grammar components are absent.

- [ ] **Step 3: Implement small components for thesis, causal flow, cycle, paired contrast, delta metric, relationship map, timeline, and layered metaphor**

Each component must render primary judgment before later supports using `useCurrentFrame`, `interpolate`, and profile easing. Use a fixed safe grid; no CSS animation, randomness, or text clipping.

- [ ] **Step 4: Verify green and typecheck**

Run: `npm test -- tests/grammars.test.tsx && npm run typecheck`

Expected: all component assertions and compilation pass.

- [ ] **Step 5: Commit**

```bash
git add src/grammars.tsx src/Root.tsx tests/grammars.test.tsx
git commit -m "feat: render editorial scene grammars"
```

### Task 6: Render evidence and machine QA

**Files:**
- Create: `scripts/render-benchmarks.mjs`, `scripts/qa-benchmarks.mjs`, `tests/qa.test.ts`

**Interfaces:**
- Produces `output/<scene-id>/{scene.mp4,opening.png,primary.png,full.png,contact-sheet.png,manifest.json,qa.json}`.
- Consumes benchmark compositions from Task 5.

- [ ] **Step 1: Write failing QA fixture test**

```ts
expect(validateQaRecord({width: 1920, height: 1080, fps: 30, durationSeconds: 8, stillCount: 3})).toBe(true);
expect(() => validateQaRecord({width: 1920, height: 1080, fps: 24, durationSeconds: 8, stillCount: 3})).toThrow('fps');
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/qa.test.ts`

Expected: failure because the QA validator is absent.

- [ ] **Step 3: Implement render orchestration and QA validation**

Render MP4 plus frames at `0`, `floor(durationFrames * 0.35)`, and `durationFrames - 1`. Use `ffprobe` to record stream metadata, calculate SHA-256, write JSON, and create a contact sheet from stills. Reject missing artifacts, non-1920×1080, non-30fps, un-decodable MP4, duration outside one frame, or not exactly three stills.

- [ ] **Step 4: Verify green, render, and QA**

Run: `npm test -- tests/qa.test.ts && npm run render:benchmarks && npm run qa:benchmarks`

Expected: all eight directories contain validated MP4/still/manifest/QA evidence.

- [ ] **Step 5: Commit source, not media**

```bash
git add scripts tests/qa.test.ts package.json
git commit -m "feat: render and verify benchmark evidence"
```

### Task 7: Review evidence, finalize project memory, and publish

**Files:**
- Create: `docs/reviews/2026-08-27-v0-human-visual-review.md`
- Modify: `PROJECT_STATE.md`, `CHANGELOG.md`, `HANDOFF.md`, `README.md`

**Interfaces:**
- Consumes fresh render manifests, QA records, and contact sheets from Task 6.
- Produces an evidence-bound review and accurate current-state handoff.

- [ ] **Step 1: Inspect all contact sheets and QA JSON**

Run: `find output -name qa.json -print | sort` and open each contact sheet for visual inspection.

- [ ] **Step 2: Record evidence, not assumptions**

For each benchmark, score the seven categories in `docs/QUALITY.md`, distinguish observed strength from limitation, and compare it with the Legacy audit without claiming untested performance.

- [ ] **Step 3: Run full verification**

Run: `npm test && npm run lint && npm run typecheck && npm run render:benchmarks && npm run qa:benchmarks && git status --short`

Expected: eight valid QA records; source checks pass; generated artifacts remain untracked/ignored.

- [ ] **Step 4: Commit and push**

```bash
git add AGENTS.md PROJECT_STATE.md README.md ROADMAP.md CHANGELOG.md HANDOFF.md docs package.json package-lock.json tsconfig.json vitest.config.ts eslint.config.mjs remotion.config.ts src benchmarks scripts tests .gitignore
git commit -m "feat: deliver mg quality v2 prototype"
git push -u origin main
```

## Plan self-review

- Spec coverage: Tasks 1–3 establish independent core and design system; Task 4 implements all eight benchmark kinds; Task 5 covers profiles/scene/motion grammar; Task 6 produces render evidence and machine QA; Task 7 records human evidence, project truth, and GitHub publication.
- Placeholder scan: no deferred implementation markers or unspecified behaviors remain.
- Type consistency: `MgScene`/`validateScene`, `EDITORIAL_CN_V1`/`fitChineseCopy`, and `BenchmarkScene` are defined before their consumers.

## Execution outcome — 2026-08-27

All seven tasks were completed in this repository. Fresh evidence is recorded in `PROJECT_STATE.md`, `HANDOFF.md`, and `docs/reviews/2026-08-27-v0-human-visual-review.md`; generated media stays in gitignored `output/`.
