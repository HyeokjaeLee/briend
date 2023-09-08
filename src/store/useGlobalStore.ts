import { createWithEqualityFn } from 'zustand/traditional';

import type Pusher from 'pusher-js';

interface GlobalStore {
  globalMenuOpened: boolean;
  setGlobalMenuOpened: (menuOpened: boolean) => void;

  addChattingRoomModalOpened: boolean;
  setAddChattingRoomModalOpened: (addGuestModalOpened: boolean) => void;

  chattingHistoryModalOpened: boolean;
  setChattingHistoryModalOpened: (chattingHistoryModalOpened: boolean) => void;

  pusher?: Pusher;
  setPusher: (pusher: Pusher) => void;
}

export const useGlobalStore = createWithEqualityFn<GlobalStore>(
  (set) => ({
    globalMenuOpened: false,
    setGlobalMenuOpened: (globalMenuOpened) => set({ globalMenuOpened }),

    addChattingRoomModalOpened: false,
    setAddChattingRoomModalOpened: (addChattingRoomModalOpened) =>
      set({ addChattingRoomModalOpened }),

    chattingHistoryModalOpened: false,
    setChattingHistoryModalOpened: (chattingHistoryModalOpened) =>
      set({ chattingHistoryModalOpened }),

    setPusher: (pusher) => set({ pusher }),
  }),
  Object.is,
);
