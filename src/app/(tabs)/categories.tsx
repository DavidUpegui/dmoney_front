import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { FormSection } from '@/components/form-section';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { TypeBadge } from '@/components/type-badge';
import { useCategories } from '@/lib/categories';
import { layout, spacing } from '@/theme';
import type { Category } from '@/types';
import { errorMessage } from '@/utils/error-message';

export default function CategoriesScreen() {
  const { push } = useRouter();
  const categories = useCategories();

  return (
    <Screen grouped>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="largeTitle">Categories</ThemedText>
          <Button
            title="+"
            accessibilityLabel="New category"
            variant="secondary"
            size="sm"
            onPress={() => push('/categories/new')}
          />
        </View>

        {categories.isLoading ? (
          <View style={styles.center}>
            <Spinner />
          </View>
        ) : categories.isError ? (
          <ErrorState
            message={errorMessage(categories.error)}
            onRetry={() => void categories.refetch()}
          />
        ) : (categories.data ?? []).length === 0 ? (
          <EmptyState
            message="No categories yet"
            actionLabel="New category"
            onAction={() => push('/categories/new')}
          />
        ) : (
          <View style={styles.list}>
            <CategoryGroup
              title="Income"
              categories={(categories.data ?? []).filter((item) => item.type === 'INCOME')}
              onSelect={(id) => push(`/categories/${id}`)}
            />
            <CategoryGroup
              title="Outcome"
              categories={(categories.data ?? []).filter((item) => item.type === 'OUTCOME')}
              onSelect={(id) => push(`/categories/${id}`)}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

type CategoryGroupProps = {
  title: string;
  categories: Category[];
  onSelect: (id: string) => void;
};

function CategoryGroup({ title, categories, onSelect }: CategoryGroupProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <FormSection title={title}>
      {categories.map((category) => (
        <ListRow
          key={category.id}
          title={category.name}
          subtitle={category.description.length > 0 ? category.description : undefined}
          trailing={<TypeBadge type={category.type} />}
          chevron
          onPress={() => onSelect(category.id)}
        />
      ))}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.lg,
    gap: layout.sectionGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  list: {
    gap: layout.sectionGap,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
