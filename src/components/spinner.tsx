import { ActivityIndicator } from 'react-native';

import { useColors } from '@/lib/theme';

type SpinnerProps = {
  size?: 'small' | 'large';
};

export function Spinner({ size = 'large' }: SpinnerProps) {
  const colors = useColors();
  return <ActivityIndicator size={size} color={colors.primary} testID="spinner" />;
}
