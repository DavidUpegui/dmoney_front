# Tasks: System

Work blocks for `SYSTEM.md`. Each `FSYS` requirement is verified wherever the
behaviour lives (screens, hooks, the auth context).

## FSYS01 — Four states on every data screen
- [x] Loading state covered on tags, categories and movements; empty/content
      covered by their capability tests
- [x] **Validado** — `fsys01_*` (3 tests)

## FSYS02 — 401 clears the session and redirects
- [x] Added the client handler test and the auth-provider session-clearing test
- [x] **Validado** — `fsys02_*` (3 tests)

## FSYS03 — Server message on errors
- [x] Error states on tags, categories and movements show the server `message`
- [x] **Validado** — `fsys03_*` (3 tests)
