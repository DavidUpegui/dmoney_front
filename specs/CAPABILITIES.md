# Capabilities

The capabilities of the front-end and the spec that covers each one.
`requirementsCheck` reads this table: entries without a spec are reported on
every run so the gap stays visible.

| Capability | Context | Spec | State |
|---|---|---|---|
| auth | `auth` | `specs/002-auth/` | modeled |
| categories | `tracker` | `specs/003-categories/` | modeled |
| tags | `tracker` | `specs/004-tags/` | modeled |
| movements | `tracker` | `specs/005-movements/` | modeled |
| foundation | `shell` | `specs/001-foundation/` | modeled |
| design | `shell` | `specs/006-design-refresh/` | legacy |

- **modeled** — requirements with IDs, audited by `requirementsCheck`.
- **legacy** — predates the requirement model; skipped until retrofitted.
- **missing** — no spec yet.

Adding a capability means adding a row here. Creating a spec folder that is not
listed in this table fails the audit.
