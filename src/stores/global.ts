'use client';

import Pusher from 'pusher-js';
import { create } from 'zustand';

import type { Dispatch, SetStateAction } from 'react';

import { LANGUAGE } from '@/constants/language';
import { PUBLIC_ENV } from '@/constants/public-env';
import type { LOCAL_STORAGE_TYPE } from '@/constants/storage-key';
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

  chattingInfo: LOCAL_STORAGE_TYPE.CHATTING_INFO;
  setChattingInfo: Dispatch<SetStateAction<LOCAL_STORAGE_TYPE.CHATTING_INFO>>;

  pusher: Pusher;
}

export const useGlobalStore = create<GlobalStore>((set) => {
  let chattingInfo = {
    index: 0,
    language: LANGUAGE.ENGLISH,
  };

  if (typeof window !== 'undefined') {
    const localChattingInfo = localStorage.getItem(
      LOCAL_STORAGE.CREATE_CHATTING_INFO,
    );

    if (localChattingInfo) {
      chattingInfo = JSON.parse(localChattingInfo);
    }
  }

  return {
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

    chattingInfo,
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

    pusher: new Pusher(PUBLIC_ENV.PUSHER_KEY, {
      cluster: PUBLIC_ENV.PUSHER_CLUSTER,
    }),
  };
});
