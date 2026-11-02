import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { SegmentedControl } from '@/components/segmented-control';
import { TextInput } from '@/components/text-input';
import { ThemedText } from '@/components/themed-text';
import { layout, spacing } from '@/theme';
import type { CategoryType } from '@/types';
import { validateDescription, validateName } from '@/utils/field-validation';

export type CategoryFormValues = {
  name: string;
  description: string;
  type: CategoryType;
};

type CategoryFormProps = {
  defaultValues?: CategoryFormValues;
  submitLabel: string;
  submitting?: boolean;
  error?: string;
  onSubmit: (values: CategoryFormValues) => void;
};

const TYPE_OPTIONS = [
  { value: 'INCOME' as const, label: 'Income' },
  { value: 'OUTCOME' as const, label: 'Outcome' },
];

export function CategoryForm({
  defaultValues,
  submitLabel,
  submitting = false,
  error,
  onSubmit,
}: CategoryFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [type, setType] = useState<CategoryType>(defaultValues?.type ?? 'OUTCOME');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const submit = () => {
    const nextErrors = {
      name: validateName(name),
      description: validateDescription(description),
    };
    setErrors(nextErrors);
    if (nextErrors.name != null || nextErrors.description != null) {
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim(), type });
  };

  return (
    <View style={styles.container}>
      {error != null ? <FormBanner message={error} /> : null}

      <FormSection>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoCapitalize="sentences"
          placeholder="Groceries"
        />
        <View style={styles.field}>
          <ThemedText variant="subhead">Type</ThemedText>
          <SegmentedControl
            accessibilityLabel="Type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={setType}
          />
        </View>
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
      </FormSection>

      <Button title={submitLabel} size="lg" loading={submitting} onPress={submit} />
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
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
