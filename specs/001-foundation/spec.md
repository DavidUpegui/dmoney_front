# Feature: App Foundation

- **Status:** `implemented`
- **Folder:** `001-foundation`
- **Related area:** `tracker` | `auth` (shared)

## UI / UX Directives

Applies to every screen in this feature. Before writing UI code, load the skills
`frontend-design`, `expo-design-system`, `expo-native-ui`, `expo-ui`,
`expo-animation`, `vercel-react-native-skills` (and `web-design-guidelines` for
the web target), routing the work through `expo-overview`.

- **Tokens only** — every color, space, radius, type size, and motion value comes
  from `@/theme`; no hardcoded values in screens or components.
- **Spacing rhythm** — 4-pt grid; screens pad 20 horizontally; group related
  fields into inset sections; separate with `gap`, not ad-hoc margins.
- **Typography** — one system type scale; build hierarchy with weight and color
  before size; money uses tabular figures.
- **Native controls first** — reach for `@expo/ui` (sheets, pickers, switches,
  grouped rows, form sections) before RN built-ins or community libraries;
  native stack + `NativeTabs` for navigation; `Pressable` over Touchables.
- **Semantic color** — light/dark via `Color` from `expo-router`; income and
  outcome use their tokens.
- **Four states** — data screens implement loading / error / empty / content;
  empty states invite an action.
- **Motion** — user-triggered feedback only (press, reveal, confirm); animate
  transform/opacity; respect reduced motion; no decorative entrances.
- **Accessibility** — labelled fields and controls, roles, visible focus,
  contrast, Dynamic Type.
- **Copy** — sentence case, active voice, the user's vocabulary; errors state
  what happened and how to fix it.

## 1. Overview

Establishes the ground the whole front-end is built on: the Expo scaffold, the
design system, the navigation shell, the typed API client, secure token
storage, and the React Query provider. No feature-specific screens or
endpoints are consumed here beyond the shared plumbing they all depend on.

Actors: an authenticated `dmoney` user (the app owner). This feature has no
user-facing flow of its own — it makes every other feature possible and
consistent.

## 2. Requirements

### Functional (FR)

- **FR-1** — The app is an Expo (React Native) project in TypeScript using
  Expo Router for navigation, with a `src/` layout (`app/`, `screens/`,
  `components/`, `hooks/`, `lib/`, `types/`).
- **FR-2** — A design token set (color, spacing, typography, radius, elevation)
  is defined once in `src/theme.ts` and consumed everywhere; no hardcoded
  colors/spacing in screens. It supports light and dark mode and uses semantic
  tokens (e.g. `surface`, `text`, `primary`, `danger`, `income`, `outcome`).
- **FR-3** — A `formatAmount(amount, currency)` utility formats money using
  `Intl.NumberFormat('es-CO')`, COP with zero decimals (e.g. `$ 12.500`).
- **FR-4** — A typed API client (`src/lib/api/`) sends JSON with a configurable
  base URL (default `http://localhost:8080`) and attaches
  `Authorization: Bearer <token>` from the token store on every `/api/**`
  request.
- **FR-5** — All non-2xx responses are parsed into a typed `ApiError`
  (`{ status, error, message, timestamp }`); network/parse failures surface a
  uniform error shape too.
- **FR-6** — The JWT is persisted via `expo-secure-store` behind a small
  `tokenStore` interface (`get`, `set`, `clear`) so auth can swap storage later.
- **FR-7** — A global `QueryClient` (TanStack React Query) is configured and
  provided at the root; every data screen and hook can rely on it.
- **FR-8** — The root navigation shell renders a four-tab layout
  (Movements, Categories, Tags, Settings) with placeholder screens so later
  features have stable routes to target.

### Non-functional (NFR)

- **NFR-1** — Security: the token is stored only in `expo-secure-store`, never
  in AsyncStorage or logs.
- **NFR-2** — Accessibility: semantic colors meet sufficient contrast in both
  light and dark mode; text uses system font scale.
- **NFR-3** — Performance: the API client is a thin wrapper (no duplicate
  parsing); React Query defaults set conservative stale/retry behavior.
- **NFR-4** — Maintainability: all shared types live in `src/types/`; all
  constants (base URL, currency) in `src/constants.ts`.

## 3. Navigation & Routes

Expo Router file tree under `src/app/`:

```
src/app/
  _layout.tsx            # root: QueryClientProvider + AuthProvider + auth gate
  (auth)/
    _layout.tsx          # Stack (header hidden)
    login.tsx            # placeholder until 002-auth
    register.tsx         # placeholder until 002-auth
  (tabs)/
    _layout.tsx          # Tabs: index, categories, tags, settings
    index.tsx            # Movements (placeholder until 005-movements)
    categories.tsx       # placeholder until 003-categories
    tags.tsx             # placeholder until 004-tags
    settings.tsx         # logout entry point (enabled in 002-auth)
```

- The root `_layout.tsx` owns the auth gate: while the persisted session is
  hydrating it shows a splash/loading state; then it routes to `(auth)` or
  `(tabs)`.
- `(auth)` and `(tabs)` are route groups; they add no URL segment.
- Tabs use the platform-native tab bar; icons are SF Symbols / Material
  equivalents.

## 4. Screens & UI

No full data screens in this feature — the tab placeholders simply render the
active route name. The foundation defines the reusable pieces other specs rely
on:

| Component | Purpose |
|-----------|---------|
| `<Screen>` | Safe-area wrapper + consistent padding/background |
| `<Spinner>` | Loading state indicator |
| `<ErrorState>` | `message` + optional `onRetry` |
| `<EmptyState>` | `message` + optional action button |
| `<Button>` / `<IconButton>` | Primary/secondary/destructive actions |
| `<TextInput>` (labelled field) | Form field with label + error text |
| `<Card>` | List-row container |

These are the canonical building blocks for the four screen states defined in
later features.

## 5. Data Fetching & API

No endpoints are consumed here. This feature defines the plumbing:

| Concern | Definition |
|---------|-----------|
| Base URL | `src/constants.ts`: `API_BASE_URL` (default `http://localhost:8080`) |
| Content type | `application/json; charset=utf-8` |
| Auth | `Authorization: Bearer <token>` on every `/api/**` call |
| Error shape | `ApiError` (see §6) |

### Status code → UI mapping (shared convention)

- `200/201/204` — success
- `400` — client validation error → show `message`
- `401` — clear token → redirect to login (owned by 002-auth)
- `404` — resource not found / belongs to another user
- `409` — duplicate name / conflict → show `message`
- `5xx` — retryable error → show retry affordance

## 6. Data Model

Shared TypeScript types:

```ts
type ApiError = {
  status: number;
  error: string;
  message: string;
  timestamp: string; // ISO-8601 instant
};

type CategoryType = 'INCOME' | 'OUTCOME';
type MovementType = 'INCOME' | 'OUTCOME' | 'TRANSFER';

interface TokenStore {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}
```

`Currency = 'COP'` with `formatAmount(amount: number, currency = 'COP'): string`.

## 7. Business Rules & Validation

- **BR-1** — The API client never throws raw `Error` on non-2xx; it always
  throws/returns a typed `ApiError` the UI can render.
- **BR-2** — A request without a stored token must still work structurally
  (it sends no `Authorization` header); the 401 flow is handled upstream.
- **BR-3** — `formatAmount` uses `es-CO`, `COP`, zero decimal digits, with the
  `$` symbol and thousands separators; `0` formats as `$ 0`.

## 8. Edge Cases

- Token store read fails (SecureStore unavailable) → treat as logged out.
- Base URL unreachable → network error surfaces a retryable `ApiError`.
- Malformed JSON body → parse failure surfaces as a uniform error, not a crash.
- Dark/light switch mid-session → tokens re-resolve without restart.
- First launch with no persisted session → splash resolves to `(auth)`.

## 9. Acceptance Criteria

- **AC-1** — Given a fresh project, when `npx expo start` runs, then the app
  boots to the four-tab shell with no runtime errors.
- **AC-2** — Given a 4xx/5xx JSON response, when the API client receives it,
  then it resolves to a typed `ApiError` with `status` and `message`.
- **AC-3** — Given a stored token, when any `/api/**` request is made, then the
  `Authorization: Bearer <token>` header is present.
- **AC-4** — Given `formatAmount(12500)`, then it returns `$ 12.500`.
- **AC-5** — Given light and dark system themes, then screens render with the
  correct semantic tokens in both.
- **AC-6** — Given the app opens with an unhydrated session, then a loading
  state is shown until the auth gate resolves (no flash of login/tabs).

## 10. Out of Scope

- Login/register forms and real auth gating logic (002-auth).
- Any resource CRUD screens (003-categories, 004-tags, 005-movements).
