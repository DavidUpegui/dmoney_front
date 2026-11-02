# Foundation

The shared plumbing every feature depends on: the Expo shell, the design tokens,
the typed API client, secure token storage, the React Query provider and the
four-tab navigation. This capability has no user-facing flow of its own.

## UI / UX Directives (temporary)

> These directives will move to `docs/ui.md` in a later pass. Until then they
> stay here and are not duplicated in other specs.

- **Tokens only** — color, space, radius, type and motion values come from
  `@/theme`; no hardcoded values.
- **Semantic color** — light and dark palettes with the same keys.
- **Spacing rhythm** — 4-pt scale; screens pad 20.
- **Typography** — one system scale with a numeric/tabular variant.
- **Accessibility** — contrast, Dynamic Type, labelled controls.
- **Motion** — user-triggered only; respect reduced motion.

## Requirements

- **FFOUND01** — The JWT is persisted only through `expo-secure-store`, behind a
  `tokenStore` with `get`, `set` and `clear`; a storage failure behaves as
  logged out.
- **FFOUND02** — The API client sends JSON to the configured base URL, attaches
  `Authorization: Bearer <token>` when a token exists, maps every non-2xx to a
  typed `ApiError`, maps network failures to the same shape, and returns
  `undefined` for `204`.
- **FFOUND03** — A global `QueryClient` is configured (5-minute `staleTime`,
  two retries) and provided at the root.
- **FFOUND04** — The design tokens expose light and dark palettes with the same
  keys, a 4-pt spacing scale, a typography ramp, radius/shadows and
  layout/control/motion values.
- **FFOUND05** — The root shell mounts the providers, the auth gate and a
  four-tab layout: Movements, Categories, Tags and Settings.
- **FFOUND06** — `formatAmount` renders COP with `Intl.NumberFormat('es-CO')`,
  thousands separators and zero decimals.

## Routes & Screens

| Screen | Route | Notes |
|--------|-------|-------|
| Root shell | `src/app/_layout.tsx` | providers + auth gate + stack |
| Auth group | `(auth)` | login/register |
| Tabs group | `(tabs)` | Movements, Categories, Tags, Settings |

No feature-specific screens are defined here.

## API Consumption

No endpoints. This capability provides the HTTP client, the token store and the
query cache all features use.

## Local model

```ts
type TokenStore = {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
};

type ApiError = { status: number; error: string; message: string; timestamp: string };
```

## Out of Scope

- Feature screens and endpoints.
- EAS builds, store submission and deployment.
- Visual polish; deferred to `docs/ui.md`.
