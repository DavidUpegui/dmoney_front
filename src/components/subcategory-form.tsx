import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { TextInput } from '@/components/text-input';
import { layout, spacing } from '@/theme';
import { validateDescription, validateName } from '@/utils/field-validation';

export type SubcategoryFormValues = {
  name: string;
  description: string;
};

type SubcategoryFormProps = {
  defaultValues?: SubcategoryFormValues;
  submitLabel: string;
  submitting?: boolean;
  error?: string;
  onDelete?: () => void;
  deleting?: boolean;
  onSubmit: (values: SubcategoryFormValues) => void;
};

export function SubcategoryForm({
  defaultValues,
  submitLabel,
  submitting = false,
  error,
  onDelete,
  deleting = false,
  onSubmit,
}: SubcategoryFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
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
    onSubmit({ name: name.trim(), description: description.trim() });
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
          placeholder="Rent"
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
      </FormSection>

      <View style={styles.actions}>
        <Button title={submitLabel} size="lg" loading={submitting} onPress={submit} />
        {onDelete != null ? (
          <Button
            title="Delete subcategory"
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
  actions: {
    gap: spacing.sm,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
