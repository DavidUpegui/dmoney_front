import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { colors, motion, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type FormBannerProps = {
  message: string;
  tone?: 'error' | 'success';
};

export function FormBanner({ message, tone = 'error' }: FormBannerProps) {
  const reduceMotion = useReducedMotion();
  const color = tone === 'error' ? colors.danger : colors.income;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      entering={reduceMotion ? undefined : FadeInDown.duration(motion.base)}
      style={[styles.container, { backgroundColor: colors.surfaceSecondary, borderColor: color }]}
    >
      <ThemedText variant="subhead" style={{ color }}>
        {message}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
