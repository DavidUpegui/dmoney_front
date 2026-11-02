# dmoney UI contract

Read this before any UI change. Use these tokens and rules. If a case is not
covered, stop and add it here; never invent a value or a component.

- Behaviour lives in `specs/`. This file is visual only.
- `src/theme.ts` is the implementation. When migrating, update both in the same
  change.
- Status: working baseline. Primary hue, font family and surface model are under
  visual test (probe pending); the values below are the current baseline.

## Principles

- Money is the hero; chrome recedes.
- One accent per screen. Semantic color only for money and type.
- Native first: no decoration that does not communicate.

## Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#0D5BFF` | `#4D8DFF` | Primary actions, selected states, links |
| `primaryPressed` | `#0045CC` | `#3B7BE8` | Pressed primary |
| `primarySurface` | `#EFF6FF` | `#102A56` | Soft accent background |
| `canvas` | `#F8FAFC` | `#0B1220` | Screen background |
| `surface` | `#FFFFFF` | `#121A2A` | Cards, sheets, rows |
| `raised` | `#FFFFFF` | `#182234` | Elevated surfaces |
| `sunken` | `#F1F5F9` | `#0F172A` | Inputs, wells, inactive tracks |
| `ink` | `#0F172A` | `#E2E8F0` | Primary text |
| `inkSecondary` | `#64748B` | `#94A3B8` | Secondary text, meta |
| `inkFaint` | `#94A3B8` | `#64748B` | Hints, inactive icons |
| `hairline` | `#E2E8F0` | `#1E293B` | Borders and dividers |
| `onPrimary` | `#FFFFFF` | `#06122A` | Text/icon on `primary` |
| `income` | `#059669` | `#34D399` | Income amounts and markers |
| `outcome` | `#DC2626` | `#F87171` | Outcome amounts and markers |
| `transfer` | `#2563EB` | `#60A5FA` | Transfer amounts and markers |
| `danger` | `#DC2626` | `#F87171` | Errors and destructive actions |
| `scrim` | `rgba(15,23,42,0.45)` | `rgba(0,0,0,0.6)` | Modals |

Rules:

- `primary` is for actions and selection, not for long body text.
- `income` / `outcome` / `transfer` only mark money. Never use them for chrome.
- No color per category. Until the back supports `icon`/`color`, all
  category/subcategory icon tiles use one generic glyph in `inkFaint`.

## Typography

Family: **Plus Jakarta Sans**, weights 400 / 500 / 600 / 700 / 800. Load it with
`expo-font`. Amounts use `fontVariant: ['tabular-nums']`.

| Token | Size / line | Weight | Use |
|---|---|---|---|
| `display` | 34 / 40 | 800 | Screen hero (rare) |
| `title` | 24 / 30 | 800 | Screen title |
| `headline` | 17 / 22 | 700 | Section title, row title |
| `body` | 16 / 24 | 400 | Body copy |
| `subhead` | 14 / 20 | 500 | Secondary copy, labels |
| `caption` | 12 / 16 | 500 | Meta, helper text |
| `label` | 12 / 16 | 700 | Uppercase field/section labels, tracking 0.06em |
| `numeric` | 16 / 20 | 700 | Row amounts |
| `numericLarge` | 32 / 38 | 800 | Hero amount |

Rules: at most three sizes per screen; hierarchy comes from weight and color,
not from more sizes. Never go below 12.

## Space, shape and elevation

| Token | Value | Use |
|---|---|---|
| `space.xs` | 4 | Icon/text gap |
| `space.sm` | 8 | Inline gap |
| `space.md` | 12 | Tight group |
| `space.lg` | 16 | Card padding, row gap |
| `space.xl` | 20 | Screen padding, section gap |
| `space.2xl` | 24 | Large separation |
| `space.3xl` | 32 | Empty-state breathing |

- Screen padding: 20. Section gap: 20. Card padding: 16. Row min height: 64.
- Radius: `sm` 10, `md` 12, `lg` 16, `xl` 20, `full` 999.
- Elevation: cards `0 1px 2px rgba(15,23,42,0.06)`; overlay
  `0 12px 32px rgba(15,23,42,0.16)`. No heavy shadows, no blur.
- Border: 1 px `hairline`. No card inside a card.
- Controls: `sm` 36, `md` 44, `lg` 52. Touch targets never below 44.

## Components

### Button
- Variants: `primary`, `secondary`, `ghost`, `destructive`.
- Sizes: `sm` / `md` / `lg`; form primary is full width and `lg`.
- Radius `md`. Label 16/20 700. Loading disables the button.
- One primary action per screen. Sentence case.

### TextInput
- Label above, 12/16 700 uppercase (`label`). Never floating labels.
- Input 16/24, height 48, radius `md`, background `sunken`, 1 px `hairline`.
- Focus: border `primary`. Error: border `danger`, message 12/16 in `danger`.
- Placeholder `inkFaint`. Multiline text aligns top.

### ListRow
- Min height 64; leading icon tile 40, radius 12, `sunken` background, generic
  glyph in `inkFaint`.
- Title 16/22 600; meta 12/16 `inkSecondary`; optional tags 12/16.
- Trailing: amount (`numeric`, tabular, semantic color) or chevron.
- Divider 1 px `hairline` between rows, not around each row.
- Pressed: opacity 0.6. No shadow.

### FormSection
- `surface`, 1 px `hairline`, radius `lg`, padding 16.
- Optional header: 12/16 700 uppercase `label` + optional trailing value.
- Rows separated by `hairline`. No nested cards.

### Chip
- Pill, visual height 32, hit area 44. Radius `full`.
- Selected: `primary` background, `onPrimary` text. Unselected: `surface`,
  `hairline` border, `inkSecondary` text.
- Label 12/16 600. No icon unless it communicates state.

### SegmentedControl
- Track `sunken`, radius `md`, padding 4. Equal segments.
- Selected: `surface`, subtle elevation, semantic text color for money type.
- Label 12/16 700. Height 40, hit area 44.

### Header
- Screen title 24/30 800, optional eyebrow 12/16 700 `label` in `inkSecondary`.
- One action, pill-shaped, `primary`. Respect the top safe area.
- No avatar, no “personal stash”, no decorative gradient.

### EmptyState
- Centered. One generic glyph 40 in `inkFaint`.
- Title 17/22 700, body 14/20 `inkSecondary`, one action.
- No illustrations.

### ErrorState
- Title “Something went wrong”, message 14/20 `inkSecondary`, `Retry` action.
- Always show the server `message` when available.

### Spinner
- `ActivityIndicator` in `primary`; small inside rows, large on screens.

### Tabs
- Four: Movements, Categories, Tags, Settings. Label 11/16 600.
- Active `primary`; inactive `inkFaint`. Native tab bar. No badges unless count.

### Sheet
- Native form sheet; native grabber. Title 24/30 800.
- Primary action pinned above the bottom safe area, full width.
- Cancel in the header or as a secondary action. Keyboard-safe scroll.
- No custom fixed header with blur inside the sheet.

## Composition

- **List screen**: header → optional summary (screen-specific) → search/filter →
  date or group sections → rows → tab bar.
- **Form sheet**: title → type selector → hero amount → classification →
  details → tags → primary action. No account, avatar or invented metadata.
- **Detail**: header → summary section → actions → related list.
- Section labels are 12/16 700 uppercase. One accent per screen.
- The month summary (Net Cash Flow / Money In / Money Out) is a screen-level
  decision for Movements, not part of this contract.

## Copy

- Sentence case. “Save movement”, “Add movement”, “Money in”, “Money out”.
- No jargon such as “Level 1 → 2”, “Cash Outflow”, “Personal Stash”.
- Errors say what happened and how to fix it. No exclamation marks.
- Labels: noun or short verb. Buttons: verb.

## Accessibility

- Contrast at least 4.5:1 for text, 3:1 for large text and UI.
- Touch targets at least 44×44, including icon-only buttons and tag remove.
- Never encode meaning with color alone; pair with sign, label or icon.
- Support Dynamic Type: no fixed heights that clip text; allow font scaling.
- Every input has a label and an accessible name. Every action has a role.
- Respect reduced motion; animation only on user action, 120–200 ms.

## Do / Don't

- Do use tokens; don't hardcode colors, sizes or spacing.
- Do one primary action; don't duplicate the same value in two places.
- Do generic icons; don't add per-category colors before the back supports them.
- Do native sheets and tab bars; don't rebuild them with fixed headers/blur.
- Do 12 px minimum labels; don't use 10 px uppercase micro-labels.
- Do soft borders and subtle shadows; don't use gradients, glass or heavy shadows.
- Do tabular numbers for money; don't use proportional figures.
- Do sentence case; don't uppercase body copy or buttons.
- Do show loading/error/empty/content; don't ship a screen with only the happy path.

## Definition of done

- Tokens only; no raw hex/px in screens or components.
- Light and dark checked; all states covered: loading, error, empty, content,
  pending, disabled.
- The server message is visible on errors.
- 44 px targets, contrast, Dynamic Type and labels verified.
- No invented data or features; no duplicated values.
- `npm run verify` is green.

## References

- `docs/ui/references/movements-light.png`
- `docs/ui/references/movements-dark.png`
- `docs/ui/references/new-movement-form.png`

These are the north star for layout and type. Ignore the invented content
(avatar, “Personal Stash”, account, times, per-category colors) and the 10 px
labels.

## Open decisions

| Decision | Current baseline | Status |
|---|---|---|
| Primary hue | electric blue `#0D5BFF` | under test |
| Font family | Plus Jakarta Sans | under test |
| Surface model | soft cards with 1 px border | under test |
