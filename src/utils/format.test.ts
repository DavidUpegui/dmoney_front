import { formatAmount } from './format';

describe('formatAmount', () => {
  it('formats COP with thousands separators and no decimals', () => {
    expect(formatAmount(12500)).toBe('$\u00a012.500');
  });

  it('formats zero as $ 0', () => {
    expect(formatAmount(0)).toBe('$\u00a00');
  });
});
