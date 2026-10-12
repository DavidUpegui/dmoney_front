# Spec-Driven Development (SDD)

This directory contains the specifications that drive the implementation of
the `dmoney` front-end (Expo + React Native). The rule is simple: **no code
without a spec first**.

## Structure

```
specs/
  README.md               # this file — conventions & workflow
  _template/              # reusable spec scaffold
    spec.md               # WHAT: requirements, routes, screens, data, rules, acceptance
    plan.md               # HOW: implementation plan mapped to src/ folders
    tasks.md              # TRACKING: checklist of work items
  001-movement/           # one folder per feature, numbered in build order
    README.md             # index: slices + order/dependencies
    001-crud/             # vertical slices (independently shippable)
    002-filter/
```

Each feature gets a numbered folder (`NNN-kebab-case-name`). Features may
contain multiple numbered **slices** — vertical, independently shippable
pieces (e.g. list vs create vs detail). Numbers reflect build order, not
priority.

## Workflow

1. **Spec** — write `spec.md` before touching code: *requirements*, *navigation
   & routes*, *screens & UI*, *data fetching & API*, *data model*, *business
   rules*, *edge cases*, and *acceptance criteria*.
2. **Plan** — break the spec into work items in `plan.md`, mapped to the Expo
   `src/` layout (`app/` → `screens/` → `components/` → `hooks/` → `utils/`).
3. **Implement** — work through `tasks.md`, ticking items off as they land.
4. **Test** — every acceptance criterion maps to at least one test (jest-expo +
   `@testing-library/react-native`, colocated as `*.test.ts(x)`).
5. **Verify** — `npx tsc --noEmit` + `npx expo lint` + `npm test` before
   marking done.

## Golden rules

- The spec is the source of truth; if code and spec disagree, reconcile them
  explicitly (never leave them divergent).
- Routes are described against the actual Expo Router file tree (`src/app/...`).
- Every data screen specifies its **four states**: loading, error, empty,
  content.
- Business rules are stated as testable statements (Given/When/Then).
- Split by **vertical slice**, never by layer.
- Global rules (auth, design tokens, data-fetching conventions) live in
  `AGENTS.md`/docs and are **not** repeated in every spec.

## Status markers

| Status         | Meaning                                  |
|----------------|------------------------------------------|
| `draft`        | Spec in progress, not yet implemented     |
| `in-progress`  | Some tasks implemented, spec stable       |
| `implemented`  | All tasks done and verified               |

## Template

```bash
cp -r specs/_template specs/NNN-your-feature
```
