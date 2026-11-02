# Testing conventions — front

## Stack

- **Runner**: Jest 29 with `jest-expo` 57.
- **Components**: `@testing-library/react-native` 14.
- **Language**: TypeScript.
- Tests are colocated with the source: `*.test.ts(x)` next to the file.

## Layout

```
src/
  lib/api/*.test.ts      # API client: fetch, token store, error mapping
  lib/*.test.tsx         # hooks: React Query queries and mutations
  utils/*.test.ts        # pure helpers, no render
  app/**/*.test.tsx      # screens: routes, four states, navigation
  components/*.test.tsx  # components: forms, validation, confirmation
```

## Test families

- **Pure helpers** — plain Jest, no render. No mocks unless the helper talks to
  the platform.
- **API client** — mock `globalThis.fetch` and `token-store`, build typed
  `Response` stubs. Assert URL, method, body and the `ApiError` mapping. Never
  hit the network.
- **Hooks** — `renderHook` with a `QueryClientProvider` configured with
  `retry: false` and `gcTime: 0`. Mock the API module (`jest.mock('@/lib/api/...')`),
  never the hook under test. Assert data, mutation calls and the invalidated
  cache keys.
- **Screens and components** — `render` from RNTL. Mock the hooks, not the API;
  mock `expo-router` when the screen navigates. Use accessibility queries
  (`getByRole`, `getByLabelText`) and `await fireEvent` / `userEvent`. Each data
  screen covers the four states: loading, error, empty, content. The global
  `jest.setup.ts` mocks safe-area and reanimated, so screen tests only mock the
  router and the hooks they use.

## Requirement traceability

Tests that verify a requirement start their title with the requirement ID in
lowercase:

```ts
it('ftag01 loads the tag list', async () => { ... });
it('fsys02 redirects to login on a 401', () => { ... });
```

- One requirement may have several tests, in different layers.
- `grep -ri ftag01` finds the requirement, its tasks and its tests.
- Tests of pure technical helpers do not need an ID.
- Jest reports the test `title`; do not hide the ID behind a wrapper that
  rewrites it.

```bash
npm run requirements
```

Runs Jest with a JSON report, cross-checks the IDs in `specs/` against the
results, and fails when an ID has no block in `tasks.md`, a block has no
requirement, `Validado` has open sub-items, `Validado` has no passing test, or
a spec is missing from `specs/CAPABILITIES.md`.

## Rules

- Every requirement marked `Validado` has at least one passing test named after
  it. Pending requirements may have none yet.
- No network, no real timers, no snapshots.
- Mock hooks in screen tests; mock the API module in hook tests.
- `npm test` runs the suite; `npm run verify` runs typecheck + lint + audit.

## Known gaps

- All current screens have at least one behavioural test; there is no coverage
  threshold.
- There is no coverage threshold.
