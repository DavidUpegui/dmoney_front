import { render } from '@testing-library/react-native';

import AppTabs from './app-tabs';

jest.mock('expo-router/native-tabs', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text, View } = jest.requireActual<typeof import('react-native')>('react-native');

  const Label = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Text, null, children);
  const Icon = () => null;

  const Trigger = Object.assign(
    ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, null, children),
    { Label, Icon },
  );

  const NativeTabs = Object.assign(
    ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, null, children),
    { Trigger },
  );

  return { NativeTabs };
});

describe('AppTabs', () => {
  it('ffound05_renders_the_four_tabs', async () => {
    const view = await render(<AppTabs />);

    expect(view.getByText('Movements')).toBeTruthy();
    expect(view.getByText('Categories')).toBeTruthy();
    expect(view.getByText('Tags')).toBeTruthy();
    expect(view.getByText('Settings')).toBeTruthy();
  });
});
