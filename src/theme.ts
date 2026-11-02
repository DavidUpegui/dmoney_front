import { type TextStyle } from 'react-native';

export type ColorTokens = {
  canvas: string;
  surface: string;
  raised: string;
  sunken: string;
  ink: string;
  inkSecondary: string;
  inkFaint: string;
  hairline: string;
  primary: string;
  primaryPressed: string;
  primarySurface: string;
  onPrimary: string;
  income: string;
  outcome: string;
  transfer: string;
  danger: string;
  placeholder: string;
  scrim: string;
};

/**
 * Petrol / Stone — light.
 * Warm stone canvas, petrol accent, AA-checked text and semantic colors.
 */
export const lightColors: ColorTokens = {
  canvas: '#F6F3EE',
  surface: '#FFFDF9',
  raised: '#FFFFFF',
  sunken: '#F2EDE6',
  ink: '#1B2A26',
  inkSecondary: '#5E6E69',
  inkFaint: '#6A7872',
  hairline: '#E1DBD1',
  primary: '#0F766E',
  primaryPressed: '#115E59',
  primarySurface: '#E4F1EE',
  onPrimary: '#FFFFFF',
  income: '#166534',
  outcome: '#B91C1C',
  transfer: '#1D4ED8',
  danger: '#B91C1C',
  placeholder: '#5E6E69',
  scrim: 'rgba(27, 42, 38, 0.45)',
};

/**
 * Petrol / Warm charcoal — dark.
 */
export const darkColors: ColorTokens = {
  canvas: '#12100E',
  surface: '#1A1714',
  raised: '#201B17',
  sunken: '#151210',
  ink: '#F2EDE7',
  inkSecondary: '#B3ACA3',
  inkFaint: '#8A8278',
  hairline: '#2C2721',
  primary: '#2DD4BF',
  primaryPressed: '#14B8A6',
  primarySurface: '#0F2E29',
  onPrimary: '#04211E',
  income: '#4ADE80',
  outcome: '#FCA5A5',
  transfer: '#60A5FA',
  danger: '#FCA5A5',
  placeholder: '#8A8278',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

/**
 * Families are weighted faces, so styles must not also set `fontWeight`.
 * Loaded in `src/app/_layout.tsx` with `expo-font`.
 */
export const fonts = {
  text: 'Manrope_400Regular',
  textMedium: 'Manrope_500Medium',
  textSemiBold: 'Manrope_600SemiBold',
  textBold: 'Manrope_700Bold',
  display: 'PlusJakartaSans_700Bold',
  displayExtraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const type = {
  largeTitle: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  headline: {
    fontFamily: fonts.textBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  rowTitle: {
    fontFamily: fonts.textBold,
    fontSize: 15,
    lineHeight: 20,
  },
  body: {
    fontFamily: fonts.text,
    fontSize: 16,
    lineHeight: 24,
  },
  subhead: {
    fontFamily: fonts.textMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.textMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  label: {
    fontFamily: fonts.textBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fonts.textBold,
    fontSize: 15,
    lineHeight: 20,
  },
  buttonSmall: {
    fontFamily: fonts.textBold,
    fontSize: 13,
    lineHeight: 16,
  },
  chip: {
    fontFamily: fonts.textSemiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  numeric: {
    fontFamily: fonts.textBold,
    fontSize: 15,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  numericSmall: {
    fontFamily: fonts.textBold,
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
  amountSymbol: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
  },
  numericLarge: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  numericHero: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
} as const satisfies Record<string, TextStyle>;

export const radius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.06)',
  raised: '0 6px 18px rgba(0, 0, 0, 0.12)',
  overlay: '0 12px 32px rgba(0, 0, 0, 0.22)',
} as const;

export const layout = {
  screenPadding: 20,
  sectionGap: 12,
  fieldGap: 12,
  groupGap: 6,
  cardPadding: 14,
  rowPaddingV: 10,
  rowPaddingH: 12,
  rowMinHeight: 56,
} as const;

export const control = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

export const motion = {
  fast: 120,
  base: 200,
  slow: 300,
} as const;

/** Hex + alpha, for tinted backgrounds derived from a semantic token. */
export function withAlpha(color: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const suffix = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${suffix}`;
}
