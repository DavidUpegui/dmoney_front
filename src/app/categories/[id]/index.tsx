import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { TypeBadge } from '@/components/type-badge';
import { useCategory, useDeleteCategory, useSubcategories } from '@/lib/categories';
import { confirmDestructive } from '@/lib/confirm';
import { layout, spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { push, back } = useRouter();
  const category = useCategory(id);
  const subcategories = useSubcategories(id);
  const removeCategory = useDeleteCategory();

  const onDelete = () => {
    confirmDestructive({
      title: 'Delete category',
      message: `Delete "${category.data?.name ?? 'this category'}" and all its subcategories?`,
      onConfirm: () => removeCategory.mutate(id, { onSuccess: () => back() }),
    });
  };

  const subcategoryList = subcategories.data ?? [];
  const ready = !category.isLoading && category.data != null;

  return (
    <Screen scroll={ready}>
      <Stack.Screen options={{ title: category.data?.name ?? 'Category' }} />

      {category.isLoading ? (
        <View style={styles.center}>
          <Spinner />
        </View>
      ) : category.isError || category.data == null ? (
        <ErrorState
          message={errorMessage(category.error)}
          onRetry={() => void category.refetch()}
        />
      ) : (
        <View style={styles.container}>
          <FormSection title="Category">
            <ListRow
              title={category.data.name}
              subtitle={category.data.description.length > 0 ? category.data.description : undefined}
              trailing={<TypeBadge type={category.data.type} />}
            />
          </FormSection>

          {removeCategory.error != null ? (
            <FormBanner
              message={errorMessage(removeCategory.error, {
                409: 'This category still has movements',
              })}
            />
          ) : null}

          <View style={styles.actions}>
            <Button
              title="Edit"
              variant="secondary"
              style={styles.actionButton}
              onPress={() => push(`/categories/${id}/edit`)}
            />
            <Button
              title="Delete"
              variant="destructive"
              loading={removeCategory.isPending}
              style={styles.actionButton}
              onPress={onDelete}
            />
          </View>

          <FormSection title="Subcategories">
            {subcategories.isLoading ? (
              <View style={styles.inline}>
                <Spinner size="small" />
              </View>
            ) : subcategories.isError ? (
              <View style={styles.inline}>
                <ThemedText variant="subhead">{errorMessage(subcategories.error)}</ThemedText>
                <Button
                  title="Retry"
                  variant="secondary"
                  size="sm"
                  onPress={() => void subcategories.refetch()}
                />
              </View>
            ) : subcategoryList.length === 0 ? (
              <ThemedText variant="subhead">No subcategories yet</ThemedText>
            ) : (
              subcategoryList.map((item, index) => (
                <ListRow
                  key={item.subcategoryId}
                  title={item.subcategoryName}
                  subtitle={
                    item.subcategoryDescription.length > 0
                      ? item.subcategoryDescription
                      : undefined
                  }
                  divider={index > 0}
                  chevron
                  onPress={() =>
                    push(`/categories/${id}/subcategories/${item.subcategoryId}/edit`)
                  }
                />
              ))
            )}
          </FormSection>

          <Button
            title="Add subcategory"
            variant="secondary"
            onPress={() => push(`/categories/${id}/subcategories/new`)}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.sectionGap,
    paddingVertical: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  inline: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
