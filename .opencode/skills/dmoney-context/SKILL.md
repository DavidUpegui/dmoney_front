---
name: dmoney-context
description: Use at the start of any work on dmoney_front to build a bounded context map before proposing or writing anything — when the user says "vamos a trabajar en X", "cómo está implementada X", "explícame X", "retomemos X", or names a screen or capability (tags, movements, categories, auth, tabs). Read-only; it never writes files and never proposes requirements.
---

# dmoney-context

Build the smallest context that lets you act correctly on `dmoney_front`. This
is step 0 of the workflow: context → requirements → delivery.

## Read, in this order

1. `AGENTS.md` (already in context) — stack, structure, conventions.
2. `docs/testing.md` — test families and naming.
3. `specs/README.md` — the requirement model.
4. `specs/SYSTEM.md` and `specs/<NNN-capability>/spec.md` — transversal and
   capability requirements.
5. `specs/CAPABILITIES.md` — which capability is modeled, legacy or missing.
6. `../dmoney_back/docs/api.md` and `../dmoney_platform/contracts/API_CONTRACT.md`
   — the HTTP surface this app consumes.
7. `docs/ui.md` if it exists. It does not exist yet; UI conventions currently
   live in `AGENTS.md` and in the capability spec.

Then route the Expo work through `expo-overview` before planning any UI change;
it selects the leaf skill (`expo-project-structure`, `expo-router`,
`expo-data-fetching`, `expo-native-ui`, `expo-design-system`, `expo-upgrade`).

Locate, with search rather than guessing:

- The route files under `src/app/` and the screen/component that render them.
- The hooks in `src/lib/` and the API modules in `src/lib/api/`.
- The tests that already cover the area.
- The spec IDs and which are `Validado` in `tasks.md`.

## Output

Answer in the chat, short and factual. No file edits.

```
Capacidad: <name> · spec: <path or "no existe"> · IDs: <FTAG01.. | ninguno>
Rutas/pantallas: <src/app/... + components>
Hooks/API: <src/lib/... + endpoints>
Tests: <files and what they cover>
Contrato: <what api.md says today>
Huecos: <what is missing to do the work>
No sé: <open questions for the user>
```

## Rules

- Do not propose requirements, designs or implementations here. Reporting a gap
  is fine; deciding what to do belongs to `dmoney-requirements`.
- If the capability has no spec, say so: the next step is requirements, not code.
- Keep the map under ~20 lines.
- Never scaffold `specs/`, never create a spec from this skill.

## Handoff

- New or changed behaviour → `dmoney-requirements`.
- Requirements already written → `dmoney-delivery`.
