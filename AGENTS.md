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

At the beginning of every Curator or engineering task:

1. Read the current `HWang0310/engineering-journal` default branch as the cross-project engineering standard source. At minimum read its `README.md`, `NEW-SESSION-BOOTSTRAP.md`, `ENGINEERING-STANDARDS.md`, `RESTRICTED-CONTENT-STANDARD.md`, `AGENT-OPERATING-MODEL.md`, `TASK-LIFECYCLE-STANDARD.md`, `PROMPT-HANDOFF-STANDARD.md`, `GIT-GITHUB-STANDARD.md`, and `CODEX-RULES.md`.
2. Record the engineering-journal remote exact SHA used for important new phases.
3. Inspect this repository remote/current branch, `git status --short --branch`, and current HEAD.
4. Read this file.
5. Read `PROJECT_STATE.md` for current operational truth.
6. Read `README.md`, `docs/INDEX.md`, and `docs/DEEPTALK-INTEGRATION.md`.
7. Read task-specific plans/tests. Consult `HANDOFF.md` for history, not as a substitute for current state.

## Roles and task lifecycle

- Curator owns project management, architecture coordination, task decomposition, technical decisions, Agent routing, exact-SHA Review, acceptance, and merge decisions.
- Mason/Rivet are the default implementation engineers for clear, verifiable work. Axiom is reserved for deep architecture, difficult debugging, high-risk runtime/Contract work, and exact-SHA review where needed.
- Formal engineering work uses a unique Task ID and follows the lifecycle defined by `engineering-journal`.
- GitHub remote exact SHA is engineering truth. Agent self-report is evidence, not acceptance.
- Default to one Writer. Parallel Writers require independent branches/worktrees, no shared mutable state, and no overlapping critical files.
- The restricted-content hard gate from `engineering-journal` is mandatory for all project-controlled source, docs, tests, fixtures, prompts, issues, commits, generated artifacts, and release material.

## GitHub-native internal handoff

- This MG repository is the canonical durable engineering handoff channel between the browser ChatGPT MG Curator and engineering Agents.
- Every formal Task ID must be recoverable from repository-native facts: task/issue context when used, branch/worktree, pushed commit(s), remote exact SHA, relevant diff, validation evidence, and Curator Review outcome.
- Normal Agent completion flow is: implement -> validate -> commit -> push -> expose branch + exact SHA. Agent self-report never replaces remote verification.
- When the MG Curator can access GitHub, the Owner should normally need to report only `Agent + Task ID completed` (or equivalent short completion signal). The Curator must then inspect this repository's remote branch, exact SHA, diff, tests/render/QA evidence, and project state directly.
- Do not require the Owner to relay long technical handoffs when the same durable facts are available in GitHub. If critical evidence exists only locally, request only the minimal supplemental evidence needed and record the resulting durable decision/state back in GitHub.
- ChatGPT, Codex, TeleAgent, or other Agent chat transcripts are not canonical project memory and should not be copied wholesale into the repository. Preserve durable engineering facts and decisions, not full conversations.
- `PROJECT_STATE.md` stores current operational truth; `HANDOFF.md` stores important chronological history/evidence; issues/PRs/commits carry task-specific traceability as appropriate.
- Plugin-internal handoff is separate from cross-project handback. After plugin-local acceptance, use the defined `PLUGIN_OPTIMIZATION_READY` protocol; only DeepTalk Nexus may independently review integration and repin Core.

## Scope and safety

- This repository owns the independent MG visual plugin. It is not DeepTalk Core.
- Never modify `HWang0310/deep-talk-studio` from this plugin project. DeepTalk Core is a read-only compatibility reference during plugin work.
- Do not silently redesign the cross-plugin Contract, Candidate Portfolio, Episode workflow, automatic editing, NLE project, or Core release policy here.
- Plugin quality work is successful only if the resulting exact SHA remains insertable into DeepTalk through `docs/DEEPTALK-INTEGRATION.md`.
- Media and generated artifacts live in local ignored output/artifact directories unless an explicit reviewed task authorizes a small non-private evidence artifact.
- No credentials, API keys, private episode material, local proxy settings, or machine-specific secrets belong in Git.

## Engineering rules

- Use test-first development for production behavior changes; capture reproducible red/green evidence.
- Keep the renderer deterministic: fixed input, profile, grammar, FPS, canvas, dependency lock, and renderer version must reproduce the same frame plan.
- Chinese text must be measured and fitted before render; never silently clip, abbreviate, or overlap semantic text.
- Machine QA verifies artifact integrity and structural assertions. Human visual review evaluates composition, rhythm, hierarchy, editorial character, usefulness, and template feeling.
- `PROJECT_STATE.md` is current operational truth; `HANDOFF.md` is chronological history.
- Before handback, run project-native tests/lint/render/QA, `git diff --check`, restricted-content review, and return branch + remote exact SHA.
