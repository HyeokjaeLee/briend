import { createWithEqualityFn } from 'zustand/traditional';

import type Pusher from 'pusher-js';

interface GlobalStore {
  globalMenuOpened: boolean;
  setGlobalMenuOpened: (menuOpened: boolean) => void;

  pusher?: Pusher;
  setPusher: (pusher: Pusher) => void;
}

export const useGlobalStore = createWithEqualityFn<GlobalStore>(
  (set) => ({
    globalMenuOpened: false,
    setGlobalMenuOpened: (globalMenuOpened) => set({ globalMenuOpened }),

    setPusher: (pusher) => set({ pusher }),
  }),
  Object.is,
);
