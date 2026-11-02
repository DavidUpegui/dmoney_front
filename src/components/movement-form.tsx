import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ChipGroup } from '@/components/chip-group';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { SegmentedControl } from '@/components/segmented-control';
import { TextInput } from '@/components/text-input';
import { ThemedText } from '@/components/themed-text';
import { useCategories, useSubcategories } from '@/lib/categories';
import { useTags } from '@/lib/tags';
import { layout, spacing, type } from '@/theme';
import type { Movement, MovementType } from '@/types';
import {
  todayIsoDate,
  validateAmount,
  validateCategoryId,
  validateDate,
  validateMovementDescription,
  validateSubcategoryId,
} from '@/utils/movement-validation';

export type MovementFormSubmit = {
  categoryId: string;
  subcategoryId: string;
  amount: number;
  type: MovementType;
  description?: string;
  date: string;
  tagIds: string[];
};

type MovementFormProps = {
  defaultValues?: Movement;
  submitLabel: string;
  submitting?: boolean;
  error?: string;
  onDelete?: () => void;
  deleting?: boolean;
  onSubmit: (values: MovementFormSubmit) => void;
};

const TYPE_OPTIONS = [
  { value: 'OUTCOME' as const, label: 'Outcome' },
  { value: 'INCOME' as const, label: 'Income' },
  { value: 'TRANSFER' as const, label: 'Transfer' },
];

const TYPE_TONE = {
  OUTCOME: 'outcome',
  INCOME: 'income',
  TRANSFER: 'transfer',
} as const;

type FieldErrors = {
  categoryId?: string;
  subcategoryId?: string;
  amount?: string;
  date?: string;
  description?: string;
};

export function MovementForm({
  defaultValues,
  submitLabel,
  submitting = false,
  error,
  onDelete,
  deleting = false,
  onSubmit,
}: MovementFormProps) {
  const categories = useCategories();
  const tags = useTags();

  const [type, setType] = useState<MovementType>(defaultValues?.type ?? 'OUTCOME');
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? '');
  const [subcategoryId, setSubcategoryId] = useState(defaultValues?.subcategoryId ?? '');
  const [amount, setAmount] = useState(
    defaultValues != null ? String(defaultValues.amount) : '',
  );
  const [date, setDate] = useState(defaultValues?.date ?? todayIsoDate());
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [tagIds, setTagIds] = useState<string[]>(defaultValues?.tagIds ?? []);
  const [errors, setErrors] = useState<FieldErrors>({});

  const subcategories = useSubcategories(categoryId);

  const categoryOptions = (categories.data ?? [])
    .filter((category) => type === 'TRANSFER' || category.type === type)
    .map((category) => ({ value: category.id, label: category.name }));

  const subcategoryOptions = (subcategories.data ?? []).map((subcategory) => ({
    value: subcategory.subcategoryId,
    label: subcategory.subcategoryName,
  }));

  const tagOptions = (tags.data ?? []).map((tag) => ({ value: tag.id, label: tag.name }));

  const selectCategory = (next: string) => {
    if (next !== categoryId) {
      setCategoryId(next);
      setSubcategoryId('');
    }
  };

  const toggleTag = (value: string) => {
    setTagIds((previous) =>
      previous.includes(value) ? previous.filter((id) => id !== value) : [...previous, value],
    );
  };

  const submit = () => {
    const nextErrors: FieldErrors = {
      categoryId: validateCategoryId(categoryId),
      subcategoryId: validateSubcategoryId(subcategoryId),
      amount: validateAmount(amount),
      date: validateDate(date),
      description: validateMovementDescription(description),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((message) => message != null)) {
      return;
    }

    const trimmedDescription = description.trim();
    onSubmit({
      categoryId,
      subcategoryId,
      amount: Number(amount.trim().replace(',', '.')),
      type,
      description: trimmedDescription.length > 0 ? trimmedDescription : undefined,
      date: date.trim(),
      tagIds,
    });
  };

  return (
    <View style={styles.container}>
      {error != null ? <FormBanner message={error} /> : null}

      <FormSection>
        <View style={styles.field}>
          <ThemedText variant="label" tone="secondary">
            Type
          </ThemedText>
          <SegmentedControl
            accessibilityLabel="Type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={setType}
            toneForValue={(value) => TYPE_TONE[value]}
            showDot
          />
        </View>

        <View style={styles.field}>
          <ThemedText variant="label" tone="secondary">
            Category
          </ThemedText>
          <ChipGroup
            options={categoryOptions}
            selected={categoryId.length > 0 ? [categoryId] : []}
            onToggle={selectCategory}
            emptyLabel={categories.isLoading ? 'Loading…' : 'No categories — add one first'}
          />
          {errors.categoryId != null ? (
            <ThemedText variant="caption" tone="danger">
              {errors.categoryId}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.field}>
          <ThemedText variant="label" tone="secondary">
            Subcategory
          </ThemedText>
          <ChipGroup
            options={subcategoryOptions}
            selected={subcategoryId.length > 0 ? [subcategoryId] : []}
            onToggle={setSubcategoryId}
            emptyLabel={categoryId.length === 0 ? 'Pick a category first' : 'No subcategories'}
          />
          {errors.subcategoryId != null ? (
            <ThemedText variant="caption" tone="danger">
              {errors.subcategoryId}
            </ThemedText>
          ) : null}
        </View>

        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          error={errors.amount}
          keyboardType="decimal-pad"
          placeholder="0"
          style={styles.amount}
        />
        <TextInput
          label="Date"
          value={date}
          onChangeText={setDate}
          error={errors.date}
          autoCapitalize="none"
          placeholder="YYYY-MM-DD"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          multiline
          numberOfLines={3}
          style={styles.multiline}
          placeholder="Optional"
        />

        <View style={styles.field}>
          <ThemedText variant="subhead">Tags</ThemedText>
          <ChipGroup
            options={tagOptions}
            selected={tagIds}
            onToggle={toggleTag}
            emptyLabel="No tags yet"
          />
        </View>
      </FormSection>

      <View style={styles.actions}>
        <Button title={submitLabel} size="lg" loading={submitting} onPress={submit} />
        {onDelete != null ? (
          <Button
            title="Delete movement"
            variant="destructive"
            loading={deleting}
            onPress={onDelete}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.sectionGap,
  },
  field: {
    gap: spacing.xs,
  },
  amount: {
    ...type.numericLarge,
    fontSize: 24,
  },
  actions: {
    gap: spacing.sm,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
