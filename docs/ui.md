# dmoney UI contract

Read this before any UI change. Use these tokens and rules. If a case is not
covered, stop and add it here; never invent a value or a component.

- Behaviour lives in `specs/`. This file is visual only.
- This file is the source of truth for values. `src/theme.ts` implements them;
  `src/app/dev/ui.tsx` is the living specimen. Update all three together.
- Status: **tokens, fonts and primitives implemented** (2026-11-02). Screens
  still migrate one by one. See “Decision log”.

## Principles

- Money is the hero; chrome recedes.
- One accent per screen. Semantic color only for money and type.
- Native first: no decoration that does not communicate.
- Warm, not clinical. Stone in light, charcoal in dark, petrol as the accent.

## Where it lives

- `src/theme.ts` — colors, families, type scale, spacing, radius, shadows,
  layout and controls. Tokens only; no screen values.
- `src/app/_layout.tsx` — loads Manrope and Plus Jakarta with `expo-font`.
- `src/components/icon.tsx` — the only icon entry point.
- `src/app/dev/ui.tsx` — the gallery. Dev only; Settings → Development → UI kit.

## Color

Petrol / Stone in light, petrol / warm charcoal in dark.

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#0F766E` | `#2DD4BF` | Primary actions, selected states, links |
| `primaryPressed` | `#115E59` | `#14B8A6` | Pressed primary |
| `primarySurface` | `#E4F1EE` | `#0F2E29` | Soft accent background |
| `canvas` | `#F6F3EE` | `#12100E` | Screen background |
| `surface` | `#FFFDF9` | `#1A1714` | Groups, sheets, rows |
| `raised` | `#FFFFFF` | `#201B17` | Floating surfaces |
| `sunken` | `#F2EDE6` | `#151210` | Inputs, icon tiles, chips, tracks |
| `ink` | `#1B2A26` | `#F2EDE7` | Primary text |
| `inkSecondary` | `#5E6E69` | `#B3ACA3` | Secondary text, meta |
| `inkFaint` | `#6A7872` | `#8A8278` | Icons, inactive tabs, hints |
| `hairline` | `#E1DBD1` | `#2C2721` | Borders and dividers |
| `onPrimary` | `#FFFFFF` | `#04211E` | Text/icon on `primary` |
| `income` | `#166534` | `#4ADE80` | Income amounts and markers |
| `outcome` | `#B91C1C` | `#FCA5A5` | Outcome amounts and markers |
| `transfer` | `#1D4ED8` | `#60A5FA` | Transfer amounts and markers |
| `danger` | `#B91C1C` | `#FCA5A5` | Errors and destructive actions |
| `placeholder` | `#5E6E69` | `#8A8278` | Input placeholder |
| `scrim` | `rgba(27,42,38,0.45)` | `rgba(0,0,0,0.6)` | Modals |

Rules:

- `primary` is for actions and selection, not for long body text.
- `income` / `outcome` / `transfer` only mark money. Never use them for chrome.
- `danger` mirrors `outcome` in this palette. Do not introduce a second red.
- No color per category. Until the back supports `icon`/`color`, all category
  and subcategory tiles use one generic glyph in `inkFaint`.
- Do not put cool slate grays on the warm canvas. Neutrals come from the table.

## Typography

Two families, never a third:

- **Display: Plus Jakarta Sans.** Screen titles, sheet titles, hero amounts.
  Weights 700 / 800.
- **Text: Manrope.** Everything else, including row amounts. Weights
  400 / 500 / 600 / 700.

Loaded in `src/app/_layout.tsx` with `expo-font`. Amounts use
`fontVariant: ['tabular-nums']`.

| Token | Size / line | Weight | Family | Use |
|---|---|---|---|---|
| `title` | 24 / 30 | 800 | Display | Screen and sheet title |
| `headline` | 17 / 22 | 700 | Text | Section title |
| `rowTitle` | 15 / 20 | 700 | Text | List row title |
| `body` | 16 / 24 | 400 | Text | Body copy |
| `subhead` | 14 / 20 | 500 | Text | Secondary copy, search |
| `caption` | 12 / 17 | 500 | Text | Meta, helper text, tags |
| `label` | 12 / 16 | 700 | Text | Uppercase labels, tracking 0.06em |
| `button` | 15 / 20 | 700 | Text | Button label |
| `buttonSmall` | 13 / 16 | 700 | Text | Header action, day net |
| `chip` | 12 / 16 | 600 | Text | Chips and segments |
| `numeric` | 15 / 20 | 700 | Text | Row amounts, tabular |
| `numericSmall` | 12 / 16 | 700 | Text | Day net, badges, tabular |
| `numericLarge` | 30 / 36 | 800 | Display | Summary total, tabular |
| `numericHero` | 38 / 46 | 800 | Display | Form amount, tabular |
| `amountSymbol` | 22 / 28 | 700 | Display | Currency symbol |

Rules: at most three sizes per screen; hierarchy comes from weight and color,
not from more sizes. Never go below 12, except the platform tab bar.

## Space, shape and elevation

| Token | Value | Use |
|---|---|---|
| `space.xs` | 4 | Icon/text gap |
| `space.sm` | 8 | Inline gap |
| `space.md` | 12 | Tight group, section gap |
| `space.lg` | 16 | Card padding |
| `space.xl` | 20 | Screen padding |
| `space.2xl` | 24 | Large separation |
| `space.3xl` | 32 | Empty-state breathing |

- Screen padding 20. Section gap 12. Group gap 6. Row gap 10. Row padding
  10 vertical / 12 horizontal. Min row height 56.
- Radius: `xs` 6 (row tags), `sm` 8 (form tags), `md` 10 (small tile),
  `lg` 12 (inputs, buttons, tiles), `xl` 16 (groups, sheets), `full` 9999.
- Elevation: groups and rows **none**. Selected segments use `shadows.card`
  (`0 1px 2px rgba(0,0,0,0.06)`). Overlays use `shadows.overlay`
  (`0 12px 32px rgba(0,0,0,0.22)`).
- Primary buttons may use a soft glow: `0 4px 14px` primary at 28%. Nothing
  else glows.
- 1 px `hairline` border. No card inside a card.
- Controls: `sm` 36, `md` 44, `lg` 52. Touch targets never below 44.

## Components

### Button
- Variants: `primary`, `secondary`, `ghost`, `destructive`.
- Sizes 36 / 44 / 52. Form primary is full width and 52.
- Radius `lg` (12). Label 15/20 700 Manrope. Loading disables the button.
- One primary action per screen. Sentence case.

### TextInput
- Label above, 12/16 700 uppercase (`label`). Never floating labels.
- Input 16/24, height 48, radius 12, background `sunken`, 1 px `hairline`.
- Focus: border `primary`. Error: border `danger`, message 12/17 in `danger`.
- Placeholder uses `placeholder`. Multiline text aligns top.

### ListGroup
- One container per group: `surface`, 1 px `hairline`, radius 16.
- Rows inside are divided by a 1 px `hairline`; no per-row borders or shadows.
- The container is the card. There is no card inside it.

### ListRow
- Min height 56; padding 10/12; gap 10.
- Leading tile 36, radius 10, `sunken`, generic glyph 18 in `inkFaint`.
- Title `rowTitle`; meta `caption` in `inkSecondary`, one line, ellipsis.
- Row tags: 12/17 600, radius 6, `sunken`, `hairline`.
- Trailing: amount (`amount`, tabular, semantic) or chevron 16 `inkFaint`.
- Pressed: opacity 0.6. No shadow.

### FormSection
- Same container as `ListGroup`; radius 16, `surface`, `hairline`.
- Optional header: `label` + optional trailing value.
- Row height grows with content; never clip Dynamic Type.
- Category and subcategory rows are not nested cards; they are rows.

### TagChip
- Two sizes: row tag 22 high, radius 6; form tag 30 high, radius 8.
- `sunken` background, 1 px `hairline`, text `caption` 600 in `inkSecondary`.
- Remove control is 44×44 hit area, icon 16 in `inkFaint`. Never a 13 px target.

### Chip (filters)
- Pill, visual height 32, hit area 44, radius `full`.
- Selected: `primary` background, `onPrimary` text. Unselected: `surface`,
  `hairline`, `inkSecondary` text. Label 12/16 600.
- No icon unless it communicates state.

### SegmentedControl
- Track `sunken`, radius 12, padding 4. Equal segments.
- Segment height 38 (hit 44), radius 9, label 12/16 700.
- Selected: `surface`, subtle elevation, text in the semantic color of the type.
- A 6 px dot marks the selected type. Do not rely on color alone.

### Header
- Title `title` in Display. Optional eyebrow `label` in `inkSecondary`.
- One action, pill 36 high with 44 hit area, `primary`.
- Respect the top safe area. No avatar, no decorative gradient.

### Search
- Height 44, radius 12, `sunken`, 1 px `hairline`.
- Search icon 16 `inkFaint`; placeholder `subhead` in `placeholder`.
- Filter button 44×44, `surface`, `hairline`; badge 20, 12/16 700,
  `primary` background, `onPrimary` text.

### EmptyState
- Centered. One generic glyph 40 in `inkFaint`.
- Title 17/22 700, body 14/20 `inkSecondary`, one action. No illustrations.

### ErrorState
- Title “Something went wrong”, message 14/20 `inkSecondary`, `Retry` action.
- Always show the server `message` when available.

### Spinner
- `ActivityIndicator` in `primary`; small inside rows, large on screens.

### Tabs
- Four: Movements, Categories, Tags, Settings. Native tab bar.
- Active `primary`; inactive `inkFaint`. No badges unless count.
- Native labels 11/16 500, 600 selected; do not change the bar height or icons
  beyond tint. Web tabs use 11/16 600.

### Sheet
- Native form sheet; native grabber. Title `title` in Display.
- Primary action pinned above the bottom safe area, full width, 52.
- Cancel 36 high with 44 hit area, in the header or as a secondary action.
- Action bar `surface` with a 1 px top `hairline`. Keyboard-safe scroll.
- No custom blurred header inside the sheet.

### Icon
- Lucide outline, 2 px stroke, sizes 16 / 18 / 20 / 24 / 40.
- Import through `src/components/icon.tsx` only; never import a set in a screen.
- Categories and subcategories use the `tag` glyph in `inkFaint` until the back
  supports `icon` / `color`. No per-category color before that.

## Composition

- **List screen**: header → optional summary (screen-specific) → search/filter →
  day or group sections → tab bar. Day label `label`; day net in a pill
  (income/outcome tint); rows in a `ListGroup`.
- **Form sheet**: title → type selector → amount hero → classification →
  details → tags → pinned primary action. No account, avatar or invented
  metadata.
- **Detail**: header → summary section → actions → related list.
- One accent per screen. The amount being typed stays `ink`; semantic color is
  for recorded money, not for the input.
- The month summary (Net cash flow / Money in / Money out) is a screen-level
  decision for Movements, not part of this contract.

## Copy

- Sentence case. “Save movement”, “Add movement”, “Money in”, “Money out”.
- No jargon such as “Level 1 → 2”, “Cash Outflow”, “Personal Stash”.
- Errors say what happened and how to fix it. No exclamation marks.
- Labels: noun or short verb. Buttons: verb.

## Accessibility

- Contrast at least 4.5:1 for text and 3:1 for meaningful UI. Decorative
  hairlines are exempt; never encode state or affordance only through them.
- Verified pairs: ink 13.5 / 16.3, inkSecondary 5.3 / 7.9, primary on surface
  5.0 / 10.2, income 6.2 / 10.2, outcome 6.4 / 9.4 (light / dark).
- Touch targets at least 44×44, including icon-only buttons and tag remove.
- Never encode meaning with color alone; pair with sign, label or icon.
- Support Dynamic Type: no fixed heights that clip text; allow font scaling.
- Every input has a label and an accessible name. Every action has a role.
- Respect reduced motion; animation only on user action, 120–200 ms.

## Do / Don't

- Do use tokens; don't hardcode colors, sizes or spacing.
- Do inset groups with dividers; don't add shadows or borders to each row.
- Do warm neutrals; don't mix cool slate grays into the canvas.
- Do one primary action; don't duplicate the same value in two places.
- Do generic icons; don't add per-category colors before the back supports them.
- Do native sheets and tab bars; don't rebuild them with fixed blur headers.
- Do 12 px minimum labels; don't use 10 px uppercase micro-labels.
- Do Manrope for text and Jakarta for display; don't use a third family.
- Do tabular numbers for money; don't use proportional figures.
- Do sentence case; don't uppercase body copy or buttons.
- Do show loading/error/empty/content; don't ship only the happy path.

## Definition of done

- Tokens only; no raw hex/px in screens or components.
- Light and dark checked; all states covered: loading, error, empty, content,
  pending, disabled.
- The server message is visible on errors.
- 44 px targets, contrast, Dynamic Type and labels verified.
- Long amounts, long descriptions and long tags do not break the row.
- No invented data or features; no duplicated values.
- `npm run verify` is green.

## References

- `docs/ui/references/movements-light.png`
- `docs/ui/references/movements-dark.png`
- `docs/ui/references/new-movement-form.png`
- `docs/ui/probe.html` — comparison probe that produced this decision
  (`?theme=&palette=&font=&display=&surface=&density=&money=&dark=`).

The images are the north star for layout and type. Ignore the invented content
(avatar, “Personal Stash”, account, times, per-category colors) and the 10 px
labels.

## Decision log

**2026-11-01 — probe v2.** Four palettes, five fonts, three surface models, two
densities, two money treatments and three dark canvases, compared at 390 px in
light and dark. Chosen:

| Axis | Decision |
|---|---|
| Palette | Petrol / Stone; warm charcoal in dark |
| Type | Manrope text + Plus Jakarta display |
| Surface | Inset groups, border only, no row shadows |
| Density | Compact |
| Money | Semantic color |
| Summary | Screen-level only, not in this contract |

Contrast corrections applied while turning the probe into tokens: light
`income` darkened from `#059669` to `#166534`; light `inkFaint` darkened from
`#93A19B` to `#6A7872`; dark `inkFaint` lightened from `#7C756C` to `#8A8278`;
`danger` follows `outcome`; placeholders use a dedicated token.

Discarded from the references: avatar, “Personal Stash”, “31 Days Period”,
fake times, “Account / Bancolombia”, “Level 1 → 2”, duplicated chips, 10 px
uppercase labels, 32 px tap targets, blurred fixed headers and footers,
per-category icons and colors.
