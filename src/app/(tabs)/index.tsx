import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BalanceSummary } from '@/components/balance-summary';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { FilterButton } from '@/components/filter-button';
import { FilterSheet } from '@/components/filter-sheet';
import { Header, HeaderAction } from '@/components/header';
import { ListGroup } from '@/components/list-group';
import { MovementRow } from '@/components/movement-row';
import { Screen } from '@/components/screen';
import { SearchField } from '@/components/search-field';
import { Spinner } from '@/components/spinner';
import { useAllSubcategories, useCategories } from '@/lib/categories';
import { useMovements } from '@/lib/movements';
import { useTags } from '@/lib/tags';
import { layout, spacing } from '@/theme';
import type { Movement, MovementFilters } from '@/types';
import { errorMessage } from '@/utils/error-message';
import { countActiveFilters, dayNet } from '@/utils/movement-filters';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

function groupByDate(items: Movement[]): { date: string; items: Movement[] }[] {
  const map = new Map<string, Movement[]>();
  for (const movement of items) {
    const bucket = map.get(movement.date) ?? [];
    bucket.push(movement);
    map.set(movement.date, bucket);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, bucket]) => ({ date, items: bucket }));
}

export default function MovementsScreen() {
  const { push } = useRouter();
  const [filters, setFilters] = useState<MovementFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const movements = useMovements(filters);
  const categories = useCategories();
  const tags = useTags();

  const data = movements.data ?? [];
  const allSubcategories = useAllSubcategories(
    (categories.data ?? []).map((category) => category.id),
  );

  const categoryNameById = new Map((categories.data ?? []).map((item) => [item.id, item.name]));
  const tagNameById = new Map((tags.data ?? []).map((item) => [item.id, item.name]));
  const subcategoryNameById = new Map<string, string>();
  for (const query of allSubcategories) {
    for (const subcategory of query.data ?? []) {
      subcategoryNameById.set(subcategory.subcategoryId, subcategory.subcategoryName);
    }
  }
  const subcategoryOptions = allSubcategories.flatMap((query) =>
    (query.data ?? []).map((subcategory) => ({
      value: subcategory.subcategoryId,
      label: subcategory.subcategoryName,
    })),
  );

  const sections = groupByDate(data);
  const activeCount = countActiveFilters(filters);
  const hasFilters = activeCount > 0;

  return (
    <Screen
      scroll
      header={
        <Header
          title="Movements"
          action={
            <HeaderAction
              label="Add"
              accessibilityLabel="New movement"
              onPress={() => push('/movements/new')}
            />
          }
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <SearchField
            value={filters.search ?? ''}
            onChangeText={(text) => setFilters((current) => ({ ...current, search: text }))}
            placeholder="Search description"
            style={styles.search}
          />
          <FilterButton count={activeCount} onPress={() => setFiltersOpen(true)} />
        </View>

        {movements.isLoading ? (
          <View style={styles.center}>
            <Spinner />
          </View>
        ) : movements.isError ? (
          <ErrorState
            message={errorMessage(movements.error)}
            onRetry={() => void movements.refetch()}
          />
        ) : data.length === 0 ? (
          <EmptyState
            message={hasFilters ? 'No matching movements' : 'No movements yet'}
            actionLabel={hasFilters ? undefined : 'Add movement'}
            onAction={hasFilters ? undefined : () => push('/movements/new')}
          />
        ) : (
          <View style={styles.list}>
            {sections.map((section) => (
              <ListGroup
                key={section.date}
                title={formatDate(section.date)}
                headerTrailing={<BalanceSummary amount={dayNet(section.items)} />}
              >
                {section.items.map((movement, index) => (
                  <MovementRow
                    key={movement.movementId}
                    movement={movement}
                    categoryName={categoryNameById.get(movement.categoryId) ?? 'Category'}
                    subcategoryName={subcategoryNameById.get(movement.subcategoryId)}
                    tagNames={movement.tagIds
                      .map((tagId) => tagNameById.get(tagId))
                      .filter((name): name is string => name != null)}
                    divider={index > 0}
                    onPress={() => push(`/movements/${movement.movementId}/edit`)}
                  />
                ))}
              </ListGroup>
            ))}
          </View>
        )}

        <FilterSheet
          visible={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onChange={setFilters}
          categories={(categories.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
          subcategories={subcategoryOptions}
          tags={(tags.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.lg,
    gap: layout.sectionGap,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  search: {
    flex: 1,
  },
  list: {
    gap: layout.sectionGap,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});
