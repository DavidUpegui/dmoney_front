import { formatAmount } from './format';

describe('formatAmount', () => {
  it('ffound06_formats_cop', () => {
    expect(formatAmount(12500)).toBe('$\u00a012.500');
  });

  it('ffound06_formats_zero', () => {
    expect(formatAmount(0)).toBe('$\u00a00');
  });
});
