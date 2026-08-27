# DeepTalk MG

DeepTalk MG is an independent research repository for improving motion-graphics assets before any future product integration.

The V0.1 prototype targets deterministic local 16:9 Chinese MG rendering. Its visual hypothesis is restrained editorial/financial design: a clear primary judgment, deliberate whitespace, strong hierarchy, progressive disclosure, and meaning-bound grammar differentiation.

It deliberately does not modify or depend on DeepTalk Core at runtime, define a shared plugin contract, create episode assets, or make final editing decisions.

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
