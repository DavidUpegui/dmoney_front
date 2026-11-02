---
name: dmoney-requirements
description: Use when eliciting, writing or changing the requirements of a dmoney_front capability — phrases like "levantemos los requisitos de tags", "qué debe hacer la pantalla de tags", "agreguemos un campo", "cambió el requisito de tags". Writes spec.md and unchecks Validado in tasks.md; never writes code or tests.
---

# dmoney-requirements

Turn what the user needs into numbered, verifiable UI guarantees. Two modes:
**elicit** (new capability or requirement) and **change** (an existing
requirement moves). Never write code in either mode.

## Read first

`AGENTS.md`, `specs/README.md`, `specs/_template/spec.md`, `specs/SYSTEM.md`,
the capability's `spec.md`/`tasks.md` if it exists, `docs/testing.md`,
`../dmoney_back/docs/api.md` and the contract. Use `dmoney-context` first if
you do not know the area.

## Mode: elicit

Ask before writing. One round of questions at a time; use the `question` tool
for choices and plain text for open ones. Never fill a gap with an assumption.

Probe, per capability:

1. **Actors and session** — who uses it? Is the screen behind the auth gate?
   What happens with an expired token (`401` → login) versus a missing resource
   (`404` → error state)?
2. **Navigation** — which routes, which layout owns them, params, deep links,
   and where the user lands after an action.
3. **API consumption** — for each endpoint: verb, path, request/response shape,
   and how each status maps to UI (`200/201` content, `400` inline, `401`
   login, `404` error, `409` inline, `5xx` retry). Confirm against `api.md`;
   never invent an API assumption that is not in the contract.
4. **Four states** — loading, error, empty, content; what each shows and what
   action it offers.
5. **Forms and validation** — which rules are client-side, which are server-side
   (`400`/`409`), what is disabled while pending, and what copy is shown.
6. **Local model** — local types, query keys, cache invalidation.
7. **Classification** — capability requirement, transversal `FSYS`
   requirement, or a convention that belongs in `AGENTS.md`/`docs/ui.md`.
8. **Out of scope** — what is deliberately not included now.

Challenge vague answers. If a sentence cannot be tested, it is not a
requirement yet.

## Write the spec

Follow `specs/_template/spec.md`. The shape is fixed:

- `# <Capability>` + 2–3 lines of context.
- `## Requirements` — the bulk, one line per ID.
- `## Routes & Screens` — screen, route, states.
- `## API Consumption` — endpoint, requirement, hook, cache key.
- `## Local model` — types and constraints.
- `## Out of Scope` — short.

Rules:

- IDs are `F` + capability + two digits: `FTAG01`, `FAUTH01`, `FSYS01`.
- IDs are immutable and never reused; a dropped requirement is struck through
  and its number stays reserved.
- One requirement is one verifiable sentence. A second rule is a second ID.
- No dates, authors, versions, priorities or status fields. No acceptance
  criteria section: the requirement is the criterion.
- Do not create `plan.md`. Do not duplicate global rules from `AGENTS.md` or
  the four-state rule from `FSYS01`.
- Do not duplicate the UI directives; they live in `docs/ui.md` once it exists
  and currently in `specs/004-tags/spec.md`.

When the screen needs a new API assumption, record it in the contract (or ask
the back-end owner to do it) in the same change set. Do not hard-code an
assumption that is not in `api.md`/the contract.

## Mode: change

1. `grep -rn "<ID>" specs/ src/` and read the tests whose titles start with the
   ID. Read the contract rows the change touches.
2. State the impact before editing: requirement, screens/hooks, tests, API
   assumption.
3. Edit the statement in place, keeping the ID. If it is a new guarantee, add a
   new ID.
4. Uncheck `Validado` in `tasks.md`, add or remove sub-items. Do not implement.
5. If the requirement is dropped, strike it through, remove its `Validado` and
   keep the ID reserved.

## Rules

- Never write production code or tests.
- Never check `Validado`.
- Never renumber an ID or reuse a retired one.
- If a "requirement" is really a design decision, record it in the spec's local
  model or in `AGENTS.md` — not as an ID.

## Handoff

Present the requirement list and get explicit confirmation, then hand off to
`dmoney-delivery` for one ID at a time.
