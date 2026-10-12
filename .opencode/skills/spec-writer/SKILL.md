---
name: spec-writer
description: Use when writing, revising, or scaffolding Spec-Driven Development specs (spec.md, plan.md, tasks.md) for the dmoney front-end (Expo + React Native). Covers spec structure, vertical-slice splitting, change management, interactive requirement gathering, and scaffolding the specs/ directory.
---

# Spec-Writer (SDD) — dmoney front-end

Write and maintain Spec-Driven Development specs for the `dmoney` front-end
(Expo + React Native). The rule is **spec-first**: no code changes until the
spec reflects the new truth.

## Before anything else

1. Read `AGENTS.md` (always in context) to load the non-negotiable rules:
   spec-first, Expo/TypeScript stack, trunk-based development, and any global
   front-end conventions recorded there.
2. Route Expo work through `expo-overview` first: confirm this is Expo work,
   detect the SDK version from `package.json`, and classify the goal. Then load
   the matching leaf skill before planning implementation details:
   - `expo-project-structure` — where files live under `src/` (`app/`,
     `screens/`, `components/`, `hooks/`, `utils/`).
   - `expo-router` — file-based routes, stacks/tabs, params, headers.
   - `expo-data-fetching` — React Query, the four screen states, mutations.
   - `expo-native-ui` / `expo-design-system` — styling, semantic colors, tokens.
3. If `specs/` does not exist, scaffold it (see "Scaffolding").

## Interactive questioning protocol

ALWAYS gather requirements by asking questions — never assume. Run the full
protocol and challenge every spec before writing it. Use the `question` tool
for choices (2–4 at a time, with recommended option first) and plain text for
open questions. Cover:

1. **Scope** — Is this one feature or several? Should it be split into
   vertical slices now (e.g. list vs create vs detail)? What's explicitly out
   of scope?
2. **Actors & auth** — Who uses it? Is the screen behind auth? What happens
   with a missing/expired token (redirect to login) vs a request for data the
   user may not access (404 / error state)? Does navigation depend on hydrated
   state (auth token, onboarding flag)?
3. **Navigation** — What routes does this add or change? Expo Router file
   structure (`src/app/...`), route params, groups, and which layout owns the
   stack/tabs. Any deep links or platform-specific routing?
4. **API consumption** — For each consumed endpoint: verb, path, request/response
   shape, and how each status code maps to UI (200 → content, 401 → login,
   404 → empty/error, 5xx → retryable error). Confirm the error-body format and
   how it's surfaced.
5. **Data & state** — Local TypeScript types/models. React Query query keys and
   mutation inventory. What is server state vs local UI state?
6. **Screens & UI** — Which screens/components, and how each data screen handles
   its **four states**: loading, error, empty, content. What are the empty and
   error affordances (next action offered)?
7. **Business rules & validation** — Form validation rules and invariants.
   Always probe: "what happens when X is empty?", "is that a client-side or
   server-side error?", "what's the optimistic/pending behavior on save?"
8. **Change impact** — Is this new, additive, behavioral, or breaking? Does it
   change navigation, consumed API contracts, shared components, or design
   tokens? Is it a new SDK/dependency (route through `expo-upgrade`)?
9. **Unknowns** — Anything the user can't answer yet becomes an explicit
   `draft` note or "Out of Scope" entry.

Challenge vague wording. If an acceptance criterion can't be written as
Given/When/Then, ask for clarification.

## Scaffolding

On first use (or if any piece is missing), create:

```
specs/
  README.md              # SDD conventions & workflow (see template below)
  _template/
    spec.md
    plan.md
    tasks.md
  001-<feature>/         # one folder per feature, numbered in build order
```

Also ensure `AGENTS.md` exists; if absent, propose generating it.

`specs/README.md` must state: spec-first rule, directory structure, workflow
(spec → plan → implement → test → verify), status markers, and "split by
vertical slice, never by layer".

## Templates

### `spec.md`

```markdown
# Feature: <Feature Name>

- **Status:** `draft`
- **Folder:** `NNN-<feature-name>`
- **Related area:** `tracker` | `auth`

## 1. Overview
What this feature does, who the actors are, what problem it solves.

## 2. Requirements
### Functional (FR)
- **FR-1** — ...
### Non-functional (NFR)
- **NFR-1** — Security/performance/accessibility (global rules from AGENTS.md apply).

## 3. Navigation & Routes
Expo Router file tree under `src/app/` with route params, groups, and layouts.

## 4. Screens & UI
Screens and components; for each data screen, the four states
(loading / error / empty / content) and their affordances.

## 5. Data Fetching & API
React Query queries/mutations (keys, endpoints, cache behavior). Consumed
endpoints with request/response JSON and a status-code → UI mapping table.

## 6. Data Model
Local TypeScript types/interfaces and their constraints.

## 7. Business Rules & Validation
Testable statements; form validation rules.

## 8. Edge Cases
Empty/null inputs, offline, duplicate submits, server errors, hydration timing.

## 9. Acceptance Criteria
- **AC-1** — Given X, when Y, then Z.  (each maps to a test)

## 10. Out of Scope
Explicitly deferred items.
```

### `plan.md`

```markdown
# Plan: <Feature Name>

## Routes (`src/app/...`)
- [ ] Route files + layouts + params

## Screens (`src/screens/...`)
- [ ] Screen bodies and their private components

## Components (`src/components/...`)
- [ ] Reusable UI pieces

## Data fetching (`src/hooks/...`, `src/lib/api/...`)
- [ ] React Query hooks (queries/mutations) + API client

## Types & constants (`src/types/`, `src/constants.ts`, `src/theme.ts`)
- [ ] Local types and any new tokens/constants

## Tests (colocated `*.test.ts(x)`)
- [ ] Component / hook tests
```

### `tasks.md`

```markdown
# Tasks: <Feature Name>

## Spec
- [ ] `spec.md` written and reviewed
## Implementation
- [ ] Routes / screens / components done
- [ ] Data fetching (React Query) done
## Tests
- [ ] Component / hook tests
## Verification
- [ ] `npx tsc --noEmit` passes
- [ ] `npx expo lint` passes
- [ ] `npm test` (jest-expo) passes
```

## Workflow

1. Scaffold if needed, then run the questioning protocol.
2. Draft `spec.md`; present it to the user and refine until they confirm.
3. Derive `plan.md` and `tasks.md` from the spec.
4. Report the status marker and the next step (implementation).

## Change management

- Always edit the spec first, then the code. Reconcile both in the same change.
- Classify changes: **additive** (append FR/AC), **behavioral** (update rule +
  AC, update tests), **breaking** (change navigation or consumed API contract,
  decide migration/fallback).
- Add a short changelog entry to the spec when a change is non-trivial.
- Consumed API contract changes → update the spec's "Data Fetching & API"
  section and the affected query/mutation hooks together.
- SDK or dependency bumps are their own task → route through `expo-upgrade`.
- **New global rule surfaced?** Propose an update to `AGENTS.md` (or a docs
  file) rather than duplicating it across feature specs.
- **Cross-cutting "not now" issue surfaced?** Record a dated one-liner in
  `OBSERVATIONS.md` and move on; delete it once resolved. Feature-specific
  "not now" items go in the spec's "Out of Scope" instead.

## Splitting a large spec

Split when: >~15–20 acceptance criteria, multiple independent deliverables,
one change touches many unrelated screens, or parallel work is possible.

- Split by **vertical slice** (shippable end-to-end), never by layer.
- Each slice keeps its own ACs + routes + API consumption; a parent `README.md`
  ties them together and states dependencies/order.
- Global rules stay in `AGENTS.md`; don't copy them into every spec.

## Status markers

`draft` → `in-progress` → `implemented`, stated at the top of each `spec.md`.
