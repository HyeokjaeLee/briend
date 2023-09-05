import { createWithEqualityFn } from 'zustand/traditional';

interface LayoutStore {
  globalMenuOpened: boolean;
  setGlobalMenuOpened: (menuOpened: boolean) => void;

  addChattingRoomModalOpened: boolean;
  setAddChattingRoomModalOpened: (addGuestModalOpened: boolean) => void;

  chattingHistoryModalOpened: boolean;
  setChattingHistoryModalOpened: (chattingHistoryModalOpened: boolean) => void;
}

export const useLayoutStore = createWithEqualityFn<LayoutStore>(
  (set) => ({
    globalMenuOpened: false,
    setGlobalMenuOpened: (globalMenuOpened) => set({ globalMenuOpened }),

    addChattingRoomModalOpened: false,
    setAddChattingRoomModalOpened: (addChattingRoomModalOpened) =>
      set({ addChattingRoomModalOpened }),

    chattingHistoryModalOpened: false,
    setChattingHistoryModalOpened: (chattingHistoryModalOpened) =>
      set({ chattingHistoryModalOpened }),
  }),
  Object.is,
);
