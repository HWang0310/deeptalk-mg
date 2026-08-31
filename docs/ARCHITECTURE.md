# V0 Architecture

## Purpose

The V0 prototype converts a self-contained `mg-scene/1` definition into a deterministic MP4, still image, contact sheet, and machine-readable QA record. It has no runtime dependency on DeepTalk Core.

```text
benchmark scene JSON
  → schema validation and copy fitting
  → visual profile tokens + grammar selection
  → deterministic frame plan
  → Remotion composition
  → MP4 / stills / contact sheet
  → structural + media QA JSON
  → human visual review Markdown
```

## Core units

- `src/model.ts`: versioned independent scene types and validation.
- `src/profiles.ts`: typography, color, spacing, motion, and layout tokens.
- `src/fit.ts`: deterministic Chinese display-copy line breaking and capacity guard.
- `src/grammars.tsx`: small grammar components. Each uses only a validated scene and profile.
- `src/Root.tsx`: benchmark compositions and deterministic still registration.
- `scripts/render-benchmarks.mjs`: stable render orchestration and manifest writing.
- `scripts/qa-benchmarks.mjs`: ffprobe, hash, dimensions, duration, and evidence QA.

## Design rules

1. A primary judgment is visible before supporting information.
2. The safe content region is fixed; grammars use a grid and cannot arbitrarily place text.
3. Typography is semantic: display, body, data, caption, and label roles have bounded size/line capacity.
4. More information is revealed through phases, not added simultaneously.
5. Motion maps to meaning: causal flow propagates, comparisons establish a shared basis, numeric change animates delta, and time advances in order.
6. Profiles vary tokens and permitted grammar behavior; they do not fork the renderer.

## Determinism

Each benchmark fixes its id, data, profile, grammar, canvas, FPS, duration, and frame capture set. The renderer uses frame-derived animation only; it does not use randomness, wall-clock time, CSS animation, APIs, or remote assets.

## Contract V1 runner boundary — IMPLEMENTED_UNRELEASED

Core-facing identity is `org.deeptalk.mg` at plugin version `1.0.0-contract-v1`. The stable external commands are `node scripts/contract-runner.js` and `node scripts/contract-runner.js --version`; the JavaScript entrypoint delegates internally to the repo-local TypeScript/vite-node implementation with explicit argv and no shell. Core does not import this repository or know its internal module paths.

The runner accepts only request/result/output-dir files. It rejects a supplied output root or existing lexical ancestor containing a symlink before creating the root, then rechecks the root after creation. Artifact paths reject absolute paths, `..`, containment escape, and existing symlink descendants. These controls are a narrow local-runner boundary, not a general filesystem sandbox.
