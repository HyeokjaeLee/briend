import { createWithEqualityFn as create } from 'zustand/traditional';

import type { Dispatch, SetStateAction } from 'react';

import { LOCAL } from '@/constants/storage-key';

interface ProfileStore {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  emoji: string;
  setEmoji: Dispatch<SetStateAction<string>>;
  isLogin?: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: '',
  setNickname: (setNicknameAction) => {
    set(({ nickname: prevNickname }) => {
      const nickname =
        typeof setNicknameAction === 'function'
          ? setNicknameAction(prevNickname)
          : setNicknameAction;

      localStorage.setItem(LOCAL.MY_NICKNAME, nickname);

      return { nickname };
    });
  },
  emoji: '',
  setEmoji: (setEmojiAction) => {
    set(({ emoji: prevEmoji }) => {
      const emoji =
        typeof setEmojiAction === 'function'
          ? setEmojiAction(prevEmoji)
          : setEmojiAction;

      localStorage.setItem(LOCAL.MY_PROFILE_EMOJI, emoji);

      return { emoji };
    });
  },
  setIsLogin: (isLogin) => set({ isLogin }),
}));
