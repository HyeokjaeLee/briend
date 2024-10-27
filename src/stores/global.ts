import { create } from 'zustand';

import type { Dispatch, SetStateAction } from 'react';

import type { NAVIGATION_ANIMATION } from '@/constants/etc';
import { LANGUAGE } from '@/constants/language';
import { LOCAL_STORAGE } from '@/constants/storage-key';

interface GlobalStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  chattingInfo: {
    index: number;
    language: LANGUAGE;
  };
  setChattingInfo: Dispatch<SetStateAction<GlobalStore['chattingInfo']>>;

  navigationAnimation?: NAVIGATION_ANIMATION;
  setNavigationAnimation: (navigationAnimation: NAVIGATION_ANIMATION) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  chattingInfo: {
    index: 0,
    language: LANGUAGE.ENGLISH,
  },
  setChattingInfo: (setChattingInfoAction) =>
    set((state) => {
      const chattingInfo =
        typeof setChattingInfoAction === 'function'
          ? setChattingInfoAction(state.chattingInfo)
          : setChattingInfoAction;

      localStorage.setItem(
        LOCAL_STORAGE.CREATE_CHATTING_INFO,
        JSON.stringify(chattingInfo),
      );

      return { chattingInfo };
    }),

  setNavigationAnimation: (navigationAnimation) => set({ navigationAnimation }),
}));
