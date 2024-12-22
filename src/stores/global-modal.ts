import { create } from 'zustand';

interface BackNoticeInfo {
  title: string;
  message: string;
}

interface GlobalModalStore {
  isGlobalModalOpen: boolean;
  setIsGlobalModalOpen: (isOpen: boolean) => void;
  backNoticeInfo: BackNoticeInfo | null;
  setBackNoticeInfo: (message: BackNoticeInfo | null) => void;
}

export const useGlobalModalStore = create<GlobalModalStore>((set) => ({
  isGlobalModalOpen: false,
  setIsGlobalModalOpen: (isOpen: boolean) => set({ isGlobalModalOpen: isOpen }),
  backNoticeInfo: null,
  setBackNoticeInfo: (backNoticeInfo: BackNoticeInfo | null) =>
    set({ backNoticeInfo }),
}));
