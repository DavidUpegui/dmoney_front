import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { Chip } from './chip';
import { ThemedText } from './themed-text';

type ChipOption = {
  value: string;
  label: string;
};

type ChipGroupProps = {
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  emptyLabel?: string;
};

export function ChipGroup({ options, selected, onToggle, emptyLabel }: ChipGroupProps) {
  if (options.length === 0) {
    return emptyLabel != null ? (
      <ThemedText variant="subhead" tone="secondary">
        {emptyLabel}
      </ThemedText>
    ) : null;
  }

  return (
    <View style={styles.wrap}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={selected.includes(option.value)}
          onPress={() => onToggle(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
