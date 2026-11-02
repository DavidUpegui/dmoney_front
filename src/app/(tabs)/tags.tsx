import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { Header, HeaderAction } from '@/components/header';
import { Icon } from '@/components/icon';
import { ListGroup } from '@/components/list-group';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { useTags } from '@/lib/tags';
import { layout, spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function TagsScreen() {
  const { push } = useRouter();
  const tags = useTags();

  return (
    <Screen
      header={
        <Header
          title="Tags"
          action={
            <HeaderAction
              label="Add"
              accessibilityLabel="New tag"
              onPress={() => push('/tags/new')}
            />
          }
        />
      }
    >
      <View style={styles.container}>
        {tags.isLoading ? (
          <View style={styles.center}>
            <Spinner />
          </View>
        ) : tags.isError ? (
          <ErrorState message={errorMessage(tags.error)} onRetry={() => void tags.refetch()} />
        ) : (tags.data ?? []).length === 0 ? (
          <EmptyState
            message="No tags yet"
            actionLabel="New tag"
            onAction={() => push('/tags/new')}
          />
        ) : (
          <ListGroup>
            {(tags.data ?? []).map((tag, index) => (
              <ListRow
                key={tag.id}
                title={tag.name}
                subtitle={tag.description.length > 0 ? tag.description : undefined}
                icon={<Icon name="tag" size={18} tone="faint" />}
                divider={index > 0}
                chevron
                onPress={() => push(`/tags/${tag.id}/edit`)}
              />
            ))}
          </ListGroup>
        )}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
