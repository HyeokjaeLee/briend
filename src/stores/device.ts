import { createWithEqualityFn as create } from 'zustand/traditional';

import { SESSION } from '@/constants/storage-key';

export type RouteType = 'back' | 'forward' | 'push' | 'replace';
interface DeviceStore {
  customHistory: Map<number, string>;
  setCustomHistory: (
    setCustomHistoryAction: (
      customHistory: DeviceStore['customHistory'],
    ) => void | DeviceStore['customHistory'],
  ) => void;

  historyIndex: number;
  setHistoryIndex: (historyIndex: number) => void;

  lastRouteType?: RouteType;
  setLastRouteType: (routeType: RouteType) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  customHistory: new Map(),
  setCustomHistory: (setCustomHistoryAction) =>
    set(({ customHistory }) => {
      const newCustomHistory =
        setCustomHistoryAction(customHistory) || customHistory;

      sessionStorage.setItem(
        SESSION.HISTORY,
        JSON.stringify(Array.from(newCustomHistory.entries())),
      );

      return { customHistory: newCustomHistory };
    }),

  historyIndex: 0,
  setHistoryIndex: (historyIndex) => {
    history.replaceState({ ...history.state, index: historyIndex }, '');

    sessionStorage.setItem(SESSION.HISTORY_INDEX, String(historyIndex));

    return set({ historyIndex });
  },

  setLastRouteType: (lastRouteType) => set({ lastRouteType }),
}));
