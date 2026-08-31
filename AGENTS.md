---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '9c28e75e-315a-4e16-b3e1-19c514d0fe36'
  PropagateID: '9c28e75e-315a-4e16-b3e1-19c514d0fe36'
  ReservedCode1: 'c4e40922-6701-4820-bd18-b3570d908b96'
  ReservedCode2: 'c4e40922-6701-4820-bd18-b3570d908b96'
---

# DeepTalk MG — Engineering Protocol

## Bootstrap

At the beginning of every task:

1. Inspect `git status --short --branch` and the current HEAD.
2. Read this file.
3. Read `PROJECT_STATE.md` for current truth.
4. Read `docs/INDEX.md`.
5. Read task-specific documents and tests.
6. Consult `HANDOFF.md` only for historical decisions or evidence.

## Scope and safety

- This repository develops an independent MG visual-asset prototype. It is not DeepTalk Core.
- Never modify `/Users/hwang/Movies/Program/DeepTalk/deep-talk-studio` while working here. It is the read-only canonical Core reference.
- Do not design a shared Visual Asset Plugin Contract, Candidate Portfolio, Episode workflow, automatic editing, NLE project, or production release here.
- Media and generated artifacts live in `output/` and remain gitignored. Git tracks definitions, QA JSON, contact sheets only when deliberately small, source, tests, and documentation.
- No credentials, API keys, private episode material, or proxy settings belong in this repository.

## Engineering rules

- Use test-first development for source behavior; record each red-green cycle in commits or HANDOFF.
- Keep the renderer deterministic: fixed input, profile, grammar, FPS, canvas, and dependency lock must reproduce the same frame plan.
- Chinese text must be measured and fitted before render; never silently clip, abbreviate, or overlap semantic text.
- Machine QA verifies artifact integrity and structural assertions. Human visual review evaluates composition, rhythm, hierarchy, editorial character, and template feeling.
- `PROJECT_STATE.md` is the canonical current truth; `HANDOFF.md` is chronological history.
