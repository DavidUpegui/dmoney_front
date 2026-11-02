import {
  control,
  darkColors,
  fonts,
  layout,
  lightColors,
  motion,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from '@/theme';

const HEX = /^#[0-9A-Fa-f]{6}$/;

describe('theme tokens', () => {
  it('ffound04_exposes_semantic_colors', () => {
    for (const palette of [lightColors, darkColors]) {
      expect(palette.canvas).toMatch(HEX);
      expect(palette.surface).toMatch(HEX);
      expect(palette.ink).toMatch(HEX);
      expect(palette.inkSecondary).toMatch(HEX);
      expect(palette.inkFaint).toMatch(HEX);
      expect(palette.hairline).toMatch(HEX);
      expect(palette.primary).toMatch(HEX);
      expect(palette.onPrimary).toMatch(HEX);
      expect(palette.income).toMatch(HEX);
      expect(palette.outcome).toMatch(HEX);
      expect(palette.transfer).toMatch(HEX);
      expect(palette.danger).toMatch(HEX);
      expect(palette.placeholder).toMatch(HEX);
    }
  });

  it('ffound04_matches_keys', () => {
    expect(Object.keys(lightColors).sort()).toEqual(Object.keys(darkColors).sort());
  });

  it('ffound04_spacing_scale', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);
    expect(spacing.xl).toBe(20);
    expect(spacing.xxl).toBe(24);
    expect(spacing.xxxl).toBe(32);
  });

  it('ffound04_typography', () => {
    expect(type.body.fontSize).toBe(16);
    expect(type.caption.fontSize).toBe(12);
    expect(type.label.textTransform).toBe('uppercase');
    expect(type.numeric.fontVariant).toContain('tabular-nums');
    expect(type.title.fontFamily).toBe(fonts.displayExtraBold);
    expect(type.body.fontFamily).toBe(fonts.text);
  });

  it('ffound04_radius_and_shadow', () => {
    expect(radius.xs).toBe(6);
    expect(radius.lg).toBe(12);
    expect(radius.xl).toBe(16);
    expect(radius.full).toBe(9999);
    expect(typeof shadows.card).toBe('string');
    expect(typeof shadows.overlay).toBe('string');
  });

  it('ffound04_layout_control_motion', () => {
    expect(layout.screenPadding).toBe(20);
    expect(layout.rowMinHeight).toBe(56);
    expect(control.md).toBe(44);
    expect(control.lg).toBe(52);
    expect(motion.base).toBe(200);
  });

  it('ffound04_with_alpha', () => {
    expect(withAlpha('#166534', 0.1)).toBe('#1665341a');
    expect(withAlpha('#166534', 1)).toBe('#166534ff');
  });
});
