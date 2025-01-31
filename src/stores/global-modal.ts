import { create } from 'zustand';

interface BackNoticeInfo {
  title: string;
  message: string;
}

interface GlobalModalStore {
  isBackNoticeModalOpen: boolean;
  setIsBackNoticeModalOpen: (isOpen: boolean) => void;
  backNoticeInfo: BackNoticeInfo | null;
  setBackNoticeInfo: (message: BackNoticeInfo | null) => void;

  isEscapeErrorModalOpen: boolean;
  setIsEscapeErrorModalOpen: (isOpen: boolean) => void;
}

export const useGlobalModalStore = create<GlobalModalStore>((set) => ({
  isBackNoticeModalOpen: false,
  setIsBackNoticeModalOpen: (isOpen: boolean) =>
    set({ isBackNoticeModalOpen: isOpen }),
  backNoticeInfo: null,
  setBackNoticeInfo: (backNoticeInfo: BackNoticeInfo | null) =>
    set({ backNoticeInfo }),

  isEscapeErrorModalOpen: false,
  setIsEscapeErrorModalOpen: (isOpen: boolean) =>
    set({ isEscapeErrorModalOpen: isOpen }),
}));
