# DeepTalk MG

DeepTalk MG is an independent research repository for improving motion-graphics assets before any future product integration.

The V0.1 prototype targets deterministic local 16:9 Chinese MG rendering. Its visual hypothesis is restrained editorial/financial design: a clear primary judgment, deliberate whitespace, strong hierarchy, progressive disclosure, and meaning-bound grammar differentiation.

It deliberately does not modify or depend on DeepTalk Core at runtime, define a shared plugin contract, create episode assets, or make final editing decisions.

## Contract V1 runner

The review branch contains an **IMPLEMENTED_UNRELEASED** local-only Visual Asset Plugin Contract V1 runner. It owns the `deeptalk-mg` / `1.0.0-contract-v1` identity, accepts file paths only, dynamically compiles supported causal/mechanism opportunities into the existing `mg-scene/1` `causal-flow` grammar, and writes a V1 result atomically.

```bash
node node_modules/vite-node/vite-node.mjs scripts/contract-runner-cli.ts --version
node node_modules/vite-node/vite-node.mjs scripts/contract-runner-cli.ts \
  --request /absolute/request.json --result /absolute/result.json --output-dir /absolute/job-output
npm run verify:contract-runner
```

It has no Core runtime import, service endpoint, network call, credential, registry, formal release, or Core integration/pin. Its generated MP4, manifest, and QA artifacts stay below the supplied output root; the verification command runs one sanitized causal opportunity twice under fresh temporary output roots.

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

Start with [PROJECT_STATE.md](PROJECT_STATE.md), then [docs/INDEX.md](docs/INDEX.md). The Legacy audit and V2 design decision are recorded under `docs/plans/`.
