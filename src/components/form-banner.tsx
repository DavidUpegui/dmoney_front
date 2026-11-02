import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { useColors } from '@/lib/theme';
import { motion, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type FormBannerProps = {
  message: string;
  tone?: 'error' | 'success';
};

export function FormBanner({ message, tone = 'error' }: FormBannerProps) {
  const colors = useColors();
  const reduceMotion = useReducedMotion();
  const accent = tone === 'error' ? colors.danger : colors.income;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      entering={reduceMotion ? undefined : FadeInDown.duration(motion.base)}
      style={[styles.container, { backgroundColor: colors.sunken, borderLeftColor: accent }]}
    >
      <ThemedText variant="subhead" style={{ color: accent }}>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
