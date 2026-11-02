import type { MovementType } from '@/types';
import { formatAmount } from '@/utils/format';
import { ThemedText, type ThemedTextTone, type ThemedTextVariant } from './themed-text';

type AmountTextProps = {
  amount: number;
  type: MovementType;
  variant?: Extract<ThemedTextVariant, 'numeric' | 'numericLarge'>;
};

const TONE: Record<MovementType, ThemedTextTone> = {
  INCOME: 'income',
  OUTCOME: 'outcome',
  TRANSFER: 'transfer',
};

const SIGN: Record<MovementType, string> = {
  INCOME: '+',
  OUTCOME: '\u2212',
  TRANSFER: '',
};

export function AmountText({ amount, type, variant = 'numeric' }: AmountTextProps) {
  const formatted = formatAmount(amount);
  const sign = SIGN[type];

  return (
    <ThemedText variant={variant} tone={TONE[type]}>
      {sign.length > 0 ? `${sign}${formatted}` : formatted}
    </ThemedText>
  );
}
