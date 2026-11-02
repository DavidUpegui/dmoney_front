import { NativeTabs } from 'expo-router/native-tabs';

import { useColors } from '@/lib/theme';

export default function AppTabs() {
  const colors = useColors();

  return (
    <NativeTabs
      iconColor={{ default: colors.inkFaint, selected: colors.primary }}
      labelStyle={{
        default: { color: colors.inkFaint, fontSize: 11, fontWeight: '500' },
        selected: { color: colors.primary, fontSize: 11, fontWeight: '600' },
      }}
      backgroundColor={colors.surface}
      shadowColor={colors.hairline}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Movements</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="categories">
        <NativeTabs.Trigger.Label>Categories</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="grid_view" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tags">
        <NativeTabs.Trigger.Label>Tags</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="tag" md="sell" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
