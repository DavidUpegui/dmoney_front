jest.mock('react-native-safe-area-context', () =>
  jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-reanimated', () => {
  const { View } = jest.requireActual('react-native');
  const Animated = { View };

  return {
    __esModule: true,
    default: Animated,
    Animated,
    FadeInDown: { duration: () => ({}) },
    useReducedMotion: () => true,
  };
});
