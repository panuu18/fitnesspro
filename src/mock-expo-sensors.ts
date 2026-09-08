// Safe Web Mock for expo-sensors
export const Pedometer = {
  isAvailableAsync: async () => false,
  requestPermissionsAsync: async () => ({ status: 'denied', granted: false }),
  getStepCountAsync: async (_start: Date, _end: Date) => ({ steps: 0 }),
  watchStepCount: (_callback: (result: { steps: number }) => void) => ({
    remove: () => {},
  }),
};

export default {
  Pedometer,
};
