import { colors, control, layout, motion, radius, shadows, spacing, type } from '@/theme';

describe('theme tokens', () => {
  it('exposes semantic color tokens', () => {
    expect(colors.surface).toBeDefined();
    expect(colors.text).toBeDefined();
    expect(colors.primary).toBeDefined();
    expect(colors.danger).toBeDefined();
    expect(colors.income).toBeDefined();
    expect(colors.outcome).toBeDefined();
    expect(colors.onPrimary).toBe('#ffffff');
  });

  it('defines the 4-point spacing scale', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
    expect(spacing.xxl).toBe(48);
  });

  it('defines the typography ramp', () => {
    expect(type.body.fontSize).toBe(17);
    expect(type.caption.fontSize).toBe(12);
  });

  it('defines radius and shadow tokens', () => {
    expect(radius.md).toBe(12);
    expect(radius.full).toBe(9999);
    expect(typeof shadows.card).toBe('string');
  });

  it('defines grouped surfaces for inset sections', () => {
    expect(colors.groupedSurface).toBeDefined();
    expect(colors.groupedCell).toBeDefined();
  });

  it('defines layout, control and motion tokens', () => {
    expect(layout.screenPadding).toBe(20);
    expect(control.md).toBe(44);
    expect(control.lg).toBe(52);
    expect(motion.base).toBe(200);
  });
});
