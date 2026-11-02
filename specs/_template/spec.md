# <Capability>

<Who uses it and what problem it solves. Two or three lines.>

## Requirements

- **FTAG01** — <One verifiable guarantee.>
- **FTAG02** — <Another one. A second rule is a second ID.>

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `<Screen>` | `/<route>` | loading, error, empty, content |

## API Consumption

| Method | Path | Req | Hook | Cache key |
|--------|------|-----|------|-----------|
| `GET` | `/api/<resource>` | FTAG01 | `use<Resource>` | `['<resource>']` |

### Status → UI

- `200/201` — content / success
- `400` — inline validation message
- `401` — redirect to login (global)
- `404` — error state
- `409` — inline message
- `5xx` — retryable error

## Local model

```ts
type <Model> = { id: string; ... };
```

## Out of Scope

- <Deliberately excluded. Keep it short.>
