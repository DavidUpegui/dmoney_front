---
name: dmoney-delivery
description: Use when implementing or validating requirements that already exist in specs/ for dmoney_front — phrases like "implementa FTAG01", "sigamos con tags", "valida lo que llevamos", "cierra la feature", "corre los tests". Runs the tasks.md block for one requirement at a time with TDD and React Native Testing Library; only marks Validado with green tests.
---

# dmoney-delivery

Implement requirements that are already written. One requirement at a time,
test first, `Validado` only with evidence.

## Preconditions

- The requirement exists in `specs/<capability>/spec.md` (or `SYSTEM.md`).
- Its block exists in the sibling `tasks.md` (`specs/tasks-system.md` for
  `FSYS`). If it is missing, create it at the right position, following
  `specs/_template/tasks.md`.
- If the requirement does not exist, stop: this is `dmoney-requirements` work.
  Do not invent an ID mid-implementation.
- Route Expo/UI work through `expo-overview` and the matching leaf skill; follow
  `AGENTS.md` (tokens from `@/theme`, kebab-case files, one named export per
  component).

## Loop, per sub-item

1. Write the failing test first. Its title starts with the lowercase ID:

   ```ts
   it('ftag01 loads the tag list', async () => { ... });
   ```

   Put it where the behaviour lives: API client (`src/lib/api`), hook
   (`src/lib`), screen (`src/app`), or component (`src/components`). Several
   tests per requirement, in different layers, is expected.
2. Run it and confirm it fails for the right reason.
3. Implement the minimum that makes it pass, keeping the four states in mind.
4. Run it again. Refactor only while green.
5. Tick the sub-item in `tasks.md`.

Do not jump to the next requirement with a red test.

## Closing a block

The requirement is done only when:

- Every sub-item in the block is checked.
- The tests whose titles start with the ID pass.

Then add or update the last line of the block:

```markdown
- [x] **Validado** — `ftag01_*` (3 tests)
```

Run the tests before writing that line. Never mark `Validado` optimistically.

## Contract sync

If the change adds or changes an API assumption (endpoint, field, status
mapping), record it in `../dmoney_platform/contracts/API_CONTRACT.md` and in
`../dmoney_back/docs/api.md` in the same change set. The front does not change
the back-end contract unilaterally; raise conflicting assumptions.

## Verification

- Per requirement: `npm test -- <path>` while iterating, then the full
  `npm test`.
- Per capability: `npm run requirements` and `npm run verify` (typecheck + lint
  + audit).
- `npm run requirements` fails when an ID has no block, a block has no
  requirement, `Validado` has open sub-items, `Validado` has no passing test,
  a spec is not registered in `CAPABILITIES.md`, or Jest is red.

## If something changes or breaks

- A test for a validated requirement goes red → uncheck `Validado` immediately,
  then fix or hand back to `dmoney-requirements` if the requirement changed.
- A requirement changes → the uncheck and the new sub-items come from
  `dmoney-requirements`. Do not edit the statement here.
- A cross-cutting issue appears out of scope → record it where the repo keeps
  observations, then continue.

## Rules

- Never write a test without a requirement ID unless it tests a pure technical
  helper.
- Never assert implementation details; assert what the user sees.
- Never create `plan.md`, status fields or changelog sections.
- Never leave the tree with a red test and a checked `Validado`.
