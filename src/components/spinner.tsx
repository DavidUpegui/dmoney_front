import { ActivityIndicator } from 'react-native';

import { colors } from '@/theme';

type SpinnerProps = {
  size?: 'small' | 'large';
};

export function Spinner({ size = 'large' }: SpinnerProps) {
  return <ActivityIndicator size={size} color={colors.primary} />;
}
