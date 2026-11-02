# Requirements-Driven Development — front

No UI behaviour without a requirement. A spec lists the guarantees this repo
owes; each one is verified by a test.

## Files

```
specs/
  CAPABILITIES.md        # capability → spec map, read by the audit
  SYSTEM.md              # transversal requirements (FSYS01...), written once
  tasks-system.md        # work blocks for the FSYS requirements
  _template/
  NNN-<capability>/
    spec.md              # requirements + routes + API consumption + local model
    tasks.md             # one block per requirement, closes with Validado
```

There is no `plan.md`. `tasks.md` is the plan.

## Requirement IDs

- Front IDs start with `F`: `FTAG01`, `FAUTH01`, `FCAT01`, `FMOV01`, `FSYS01`.
- Transversal: `FSYS01…` in `SYSTEM.md`.
- An ID is written once. Never renumber it, never reuse it. A dropped
  requirement is struck through and its number stays reserved.
- One requirement is one verifiable sentence. A second rule is a second ID.
- IDs do not cross repositories: back-end IDs (`TAG01`) are a different
  namespace. The shared contract talks about the back-end IDs.

## `spec.md`

```markdown
# <Capability>

<2-3 lines of context: who uses it and what problem it solves.>

## Requirements

- **FTAG01** — <guarantee the UI must provide.>

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `TagList` | `/tags` | loading, error, empty, content |

## API Consumption

| Method | Path | Req | Hook | Cache key |
|--------|------|-----|------|-----------|
| `GET` | `/api/tags` | FTAG01 | `useTags` | `['tags']` |

## Local model

<Local types and their constraints.>

## Out of Scope

<Deliberately excluded. Keep it short.>
```

No dates, versions, priorities or status fields.

## `tasks.md`

One block per requirement, in execution order:

```markdown
## FTAG01 — List tags
- [x] `useTags` hook (`lib`)
- [x] `TagList` screen (`app`)
- [x] Four-state rendering test (`components`)
- [x] **Validado** — `ftag01_*` (3 tests)
```

Rules:

- **`Validado` is the last line of every block.** The requirement is not done
  while that box is unchecked.
- It may only be checked when every box is checked **and** the tests that
  reference the ID pass.
- If a requirement changes or a test goes red, uncheck `Validado` first.
- Sub-items name the layer (`app`, `components`, `lib`, `utils`).

## Tests

A test that verifies a requirement starts its title with the lowercase ID:

```ts
it('ftag01 loads the tag list', async () => { ... });
```

See `docs/testing.md`.

## Definition of done

- A requirement: every box in its block checked plus `Validado` with evidence.
- A capability: every ID in its `spec.md` has `Validado`.

## Audit

```bash
npm run requirements
```

Runs Jest with a JSON report and fails when: an ID has no block in `tasks.md`,
a block does not match any requirement, a block is `Validado` with unchecked
boxes, `Validado` has no passing test, a spec is not in `CAPABILITIES.md`, or
the test suite itself is red. It runs as part of `npm run verify`.

## Capabilities

`CAPABILITIES.md` lists every capability and the spec that covers it. The audit
reports entries marked `missing` on every run. Adding a capability means adding
a row; creating a spec folder that is not listed fails the audit.

## Slices

Split a capability into numbered slices when it has independent deliverables.
Slices are vertical, never by layer. The parent `README.md` lists the slices
and their order.

## Legacy

Specs without requirement IDs are skipped by the audit. They must be
retrofitted before they can be changed safely. The current legacy set is in
`CAPABILITIES.md` with state `legacy`.

## UI directives

The UI/UX directives still live in `specs/004-tags/spec.md` for now. They will
move to `docs/ui.md` in a later pass; new specs should not duplicate them.
