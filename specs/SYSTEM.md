# System

Requirements that hold for the whole app, independent of any capability.
They are written once here and never repeated in a capability spec.

## Requirements

- **FSYS01** — Every screen that loads data implements four states: loading,
  error, empty and content.
- **FSYS02** — A `401` clears the session and redirects to login.
- **FSYS03** — API errors surface the server message via `errorMessage`, never
  the raw error object.

## Out of Scope

- Visual polish, design tokens and motion rules. They are conventions in
  `AGENTS.md` and the capability specs until `docs/ui.md` exists.
- Offline mode and background sync.
