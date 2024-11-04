'use client';

import { create } from 'zustand';

import type { Dispatch, SetStateAction } from 'react';

import { LANGUAGE } from '@/constants/language';
import { LOCAL_STORAGE } from '@/constants/storage-key';

interface GlobalLoadingOptions {
  delay?: 0 | 100 | 200 | 300;
}

interface GlobalStore {
  globalLoading: {
    value: boolean;
    options?: GlobalLoadingOptions;
  };
  setGlobalLoading: (
    isLoading: boolean,
    options?: GlobalLoadingOptions,
  ) => void;

  chattingInfo: {
    index: number;
    language: LANGUAGE;
  };
  setChattingInfo: Dispatch<SetStateAction<GlobalStore['chattingInfo']>>;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  globalLoading: {
    value: false,
  },
  setGlobalLoading: (isLoading, options) =>
    set({
      globalLoading: {
        value: isLoading,
        options,
      },
    }),

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
}));
