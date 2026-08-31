# DeepTalk MG

DeepTalk MG is an independent research repository for improving motion-graphics assets before any future product integration.

The V0.1 prototype targets deterministic local 16:9 Chinese MG rendering. Its visual hypothesis is restrained editorial/financial design: a clear primary judgment, deliberate whitespace, strong hierarchy, progressive disclosure, and meaning-bound grammar differentiation.

It deliberately does not modify or depend on DeepTalk Core at runtime, define a shared plugin contract, create episode assets, or make final editing decisions.

## Contract V1 runner

The review branch contains an **IMPLEMENTED_UNRELEASED** local-only Visual Asset Plugin Contract V1 runner. It owns the Core-facing `org.deeptalk.mg` / `1.0.0-contract-v1` identity, accepts file paths only, dynamically compiles supported causal/mechanism opportunities into the existing `mg-scene/1` `causal-flow` grammar, and writes a V1 result atomically.

```bash
node scripts/contract-runner.js --version
node scripts/contract-runner.js \
  --request /absolute/request.json --result /absolute/result.json --output-dir /absolute/job-output
npm run verify:contract-runner
```

The stable JavaScript entrypoint delegates internally through the repo-local `vite-node` tool to the TypeScript implementation; callers do not need to know that internal path. It uses explicit argv without a shell, propagates the implementation exit code, keeps normal Contract transport off stdout, and emits only the version for `--version`.

It has no Core runtime import, service endpoint, network call, credential, registry, formal release, or Core integration/pin. Its generated MP4, manifest, and QA artifacts stay below the supplied output root. The output root and every existing lexical ancestor must not be a symlink; artifact paths also reject absolute paths, `..`, containment escape, and symlink descendants. The verification command runs one sanitized causal opportunity twice under fresh canonicalized temporary output roots.

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
