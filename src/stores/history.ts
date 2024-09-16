import { nanoid } from 'nanoid';
import { createWithEqualityFn as create } from 'zustand/traditional';

import { SESSION } from '@/constants/storage-key';

export type RouteType = 'back' | 'forward' | 'push' | 'replace' | 'reload';

type CustomHistory = Map<number, string>;

interface HistoryStore {
  customHistory: CustomHistory;
  setCustomHistory: (
    setCustomHistoryAction: (
      customHistory: CustomHistory,
    ) => CustomHistory | void,
  ) => void;

  historyIndex: number;
  setHistoryIndex: (historyIndex: number) => void;

  lastRouteType?: RouteType;
  setLastRouteType: (routeType: RouteType) => void;

  historyId?: string;
  setHistoryId: (historyId: string) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  url?: string;

  reset: () => void;
}

export const getHistorySession = () => {
  const historyIdSession = sessionStorage.getItem(SESSION.HISTORY_ID);
  const historyIndexSession = sessionStorage.getItem(SESSION.HISTORY_INDEX);
  const historySession = sessionStorage.getItem(SESSION.HISTORY);

  if (!historyIdSession || !historyIndexSession || !historySession) return null;

  return {
    id: historyIdSession,
    index: Number(historyIndexSession),
    history: JSON.parse(historySession) as [number, string][],
  };
};

export const useHistoryStore = create<HistoryStore>((set) => {
  const setCustomHistorySession = (
    customHistory: HistoryStore['customHistory'],
  ) => {
    sessionStorage.setItem(
      SESSION.HISTORY,
      JSON.stringify(Array.from(customHistory.entries())),
    );
  };

  const setHistoryIndexSession = (
    historyIndex: number,
    customHistory: HistoryStore['customHistory'],
  ) => {
    const historyId = sessionStorage.getItem(SESSION.HISTORY_ID);

    if (!historyId) throw new Error('historyId is not found');

    const historyState = history.state;

    historyState[historyId] = historyIndex;

    history.replaceState(historyState, '');

    sessionStorage.setItem(SESSION.HISTORY_INDEX, String(historyIndex));

    customHistory.set(historyIndex, location.pathname + location.search);

    setCustomHistorySession(customHistory);
  };

  const setHistoryIdSession = (historyId: string) => {
    sessionStorage.setItem(SESSION.HISTORY_ID, historyId);
  };

  return {
    customHistory: new Map(),
    setCustomHistory: (setCustomHistoryAction) =>
      set(({ customHistory }) => {
        customHistory = setCustomHistoryAction(customHistory) || customHistory;

        setCustomHistorySession(customHistory);

        return { customHistory };
      }),
    historyIndex: 0,
    setHistoryIndex: (historyIndex) =>
      set(({ customHistory }) => {
        setHistoryIndexSession(historyIndex, customHistory);

        return { historyIndex, customHistory };
      }),

    setLastRouteType: (lastRouteType) => set({ lastRouteType }),

    setHistoryId: (historyId) => {
      setHistoryIdSession(historyId);

      return set({ historyId });
    },

    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),

    reset: () =>
      set(({ customHistory }) => {
        const historyId = nanoid();

        setHistoryIdSession(historyId);

        customHistory.clear();

        setHistoryIndexSession(0, customHistory);

        return {
          historyIndex: 0,
          customHistory,
          historyId,
        };
      }),
  };
});
