import { createWithEqualityFn as create } from 'zustand/traditional';

interface DeviceStore {
  customHistory: Map<number, string>;
  setCustomHistory: (
    setCustomHistoryAction: (
      customHistory: DeviceStore['customHistory'],
    ) => void | DeviceStore['customHistory'],
  ) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  customHistory: new Map(),
  setCustomHistory: (setCustomHistoryAction) =>
    set(({ customHistory }) => {
      const newCustomHistory = setCustomHistoryAction(customHistory);

      if (newCustomHistory) {
        return { history: new Map(newCustomHistory) };
      }

      return { customHistory };
    }),
}));
