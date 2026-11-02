import { useRouter } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { Icon } from '@/components/icon';
import { ListGroup } from '@/components/list-group';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { useAuth } from '@/lib/auth';
import { layout, spacing } from '@/theme';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { push } = useRouter();

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      void signOut();
      return;
    }
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <Screen header={<Header title="Settings" />}>
      <View style={styles.container}>
        <ListGroup title="Account">
          <ListRow title="You are signed in" />
        </ListGroup>

        <ListGroup>
          <ListRow title="Sign out" destructive onPress={confirmSignOut} />
        </ListGroup>

        {__DEV__ ? (
          <ListGroup title="Development">
            <ListRow
              title="UI kit"
              subtitle="Tokens, type and components"
              icon={<Icon name="grid" size={18} tone="faint" />}
              chevron
              onPress={() => push('/dev/ui')}
            />
          </ListGroup>
        ) : null}
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
});
