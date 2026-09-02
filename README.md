# DeepTalk MG

DeepTalk MG is an independent motion-graphics visual plugin for DeepTalk. It owns its rendering internals and visual-quality roadmap while remaining callable through the DeepTalk visual-plugin boundary.

The renderer targets deterministic local 16:9 Chinese MG output. Its visual hypothesis is restrained editorial/financial design: a clear primary judgment, deliberate whitespace, strong hierarchy, progressive disclosure, and meaning-bound grammar differentiation.

## Current Accepted Runtime

- Plugin identity: `org.deeptalk.mg`
- Contract: `visual-asset-plugin-contract/1`
- Accepted runtime base: `7ae59f1115da8a011113c81f31d320783b0ce8a4`
- Canonical runner: `node scripts/contract-runner.js`
- Reported version: `1.0.0-contract-v1`
- Status: `ACCEPTED / IMPLEMENTED_UNRELEASED`
- DeepTalk compatibility reference: `HWang0310/deep-talk-studio` accepted Phase 5 baseline `db172cecc60ca6b0c276ec42010b113a767bc7b3`

Repository governance rule: `main` represents the latest plugin-local accepted stable runtime. New optimization work starts from `main` on an isolated task branch. A plugin-local PASS does **not** authorize DeepTalk Core to repin automatically; DeepTalk Nexus performs a separate integration review first.

See [docs/DEEPTALK-INTEGRATION.md](docs/DEEPTALK-INTEGRATION.md) before any quality or runtime change.

## Contract V1 runner

The repository contains an **IMPLEMENTED_UNRELEASED** local-only Visual Asset Plugin Contract V1 runner. It owns the Core-facing `org.deeptalk.mg` / `1.0.0-contract-v1` identity, accepts file paths only, dynamically compiles supported causal/mechanism opportunities into the existing `mg-scene/1` `causal-flow` grammar, and writes a V1 result atomically.

```bash
node scripts/contract-runner.js --version
node scripts/contract-runner.js \
  --request /absolute/request.json --result /absolute/result.json --output-dir /absolute/job-output
npm run verify:contract-runner
```

The stable JavaScript entrypoint delegates internally through the repo-local `vite-node` tool to the TypeScript implementation; callers do not need to know that internal path. It uses explicit argv without a shell, propagates the implementation exit code, keeps normal Contract transport off stdout, and emits only the version for `--version`.

It has no Core runtime import, service endpoint, network call, credential, registry, formal release, or Core-owned editing behavior. Generated MP4, manifest, and QA artifacts stay below the supplied output root. The output root and every existing lexical ancestor must not be a symlink; artifact paths also reject absolute paths, `..`, containment escape, and symlink descendants. The verification command runs one sanitized causal opportunity twice under fresh canonicalized temporary output roots.

## Quick start

```bash
npm install
npm test
npm run lint
npm run typecheck
npm run render:benchmarks
npm run qa:benchmarks
```

Generated media and QA output are placed under `output/` and are not committed.

## Documentation

Start with [PROJECT_STATE.md](PROJECT_STATE.md), then [docs/INDEX.md](docs/INDEX.md) and [docs/DEEPTALK-INTEGRATION.md](docs/DEEPTALK-INTEGRATION.md). Historical decisions remain under `HANDOFF.md` and `docs/plans/`.
