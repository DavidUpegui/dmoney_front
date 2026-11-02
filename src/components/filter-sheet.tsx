import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ChipGroup } from '@/components/chip-group';
import { SegmentedControl } from '@/components/segmented-control';
import { TextInput } from '@/components/text-input';
import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/lib/theme';
import { layout, radius, spacing } from '@/theme';
import type { MovementFilters, MovementType } from '@/types';
import { hasActiveFilters } from '@/utils/movement-filters';

type FilterOption = {
  value: string;
  label: string;
};

type TypeFilter = 'ALL' | MovementType;

type FilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  filters: MovementFilters;
  onChange: (filters: MovementFilters) => void;
  categories: FilterOption[];
  subcategories: FilterOption[];
  tags: FilterOption[];
};

const TYPE_OPTIONS = [
  { value: 'ALL' as const, label: 'All' },
  { value: 'OUTCOME' as const, label: 'Out' },
  { value: 'INCOME' as const, label: 'In' },
  { value: 'TRANSFER' as const, label: 'Move' },
];

function toggle(list: string[] | undefined, value: string): string[] {
  const current = list ?? [];
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

export function FilterSheet({
  visible,
  onClose,
  filters,
  onChange,
  categories,
  subcategories,
  tags,
}: FilterSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const active = hasActiveFilters(filters);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.scrim }]}
        accessibilityLabel="Close filters"
        onPress={onClose}
      />
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.canvas, paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={[styles.grabber, { backgroundColor: colors.hairline }]} />
        <View style={styles.header}>
          <ThemedText variant="title">Filters</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear filters"
            disabled={!active}
            onPress={() => onChange({})}
            hitSlop={spacing.sm}
          >
            <ThemedText variant="buttonSmall" tone={active ? 'primary' : 'faint'}>
              Clear
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.field}>
            <ThemedText variant="label" tone="secondary">
              Type
            </ThemedText>
            <SegmentedControl
              accessibilityLabel="Type filter"
              options={TYPE_OPTIONS}
              value={(filters.type ?? 'ALL') as TypeFilter}
              onChange={(value) =>
                onChange({ ...filters, type: value === 'ALL' ? undefined : value })
              }
            />
          </View>

          <View style={styles.field}>
            <ThemedText variant="label" tone="secondary">
              Categories
            </ThemedText>
            <ChipGroup
              options={categories}
              selected={filters.categoryIds ?? []}
              onToggle={(value) =>
                onChange({ ...filters, categoryIds: toggle(filters.categoryIds, value) })
              }
              emptyLabel="No categories yet"
            />
          </View>

          <View style={styles.field}>
            <ThemedText variant="label" tone="secondary">
              Subcategories
            </ThemedText>
            <ChipGroup
              options={subcategories}
              selected={filters.subcategoryIds ?? []}
              onToggle={(value) =>
                onChange({
                  ...filters,
                  subcategoryIds: toggle(filters.subcategoryIds, value),
                })
              }
              emptyLabel="No subcategories yet"
            />
          </View>

          <View style={styles.field}>
            <ThemedText variant="label" tone="secondary">
              Tags
            </ThemedText>
            <ChipGroup
              options={tags}
              selected={filters.tagIds ?? []}
              onToggle={(value) => onChange({ ...filters, tagIds: toggle(filters.tagIds, value) })}
              emptyLabel="No tags yet"
            />
          </View>

          <View style={styles.dates}>
            <View style={styles.dateField}>
              <TextInput
                label="From"
                value={filters.dateFrom ?? ''}
                onChangeText={(text) => onChange({ ...filters, dateFrom: text })}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.dateField}>
              <TextInput
                label="To"
                value={filters.dateTo ?? ''}
                onChangeText={(text) => onChange({ ...filters, dateTo: text })}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        <Button title="Done" size="lg" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    marginTop: 'auto',
    maxHeight: '88%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderCurve: 'continuous',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    gap: layout.fieldGap,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    gap: layout.fieldGap,
    paddingBottom: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  dates: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateField: {
    flex: 1,
  },
});
