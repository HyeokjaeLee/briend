import { createWithEqualityFn } from 'zustand/traditional';

import { LOCAL_STORAGE } from '@/constants';

interface AuthStore {
  isBinded: boolean;
  setIsBinded: (isBinded: boolean) => void;

  userId?: string | null;
  setUserId: (userId: string | null) => void;

  userName?: string | null;
  setUserName: (userName: string | null) => void;

  isSaveLogIn: boolean;
  setIsSaveLogIn: (isLoginInfo: boolean) => void;

  isLogin: boolean;
}

export const useAuthStore = createWithEqualityFn<AuthStore>((set, get) => {
  const saveStorageValue = (key: LOCAL_STORAGE, value: string | null) => {
    const { isSaveLogIn } = get();

    if (value) {
      if (isSaveLogIn) localStorage.setItem(key, value);

      document.cookie = `${key}=${value}; path=/;`;
    } else document.cookie = `${key}=; path=/;`;

    if (!isSaveLogIn || !value) localStorage.removeItem(key);
  };

  return {
    isBinded: false,
    setIsBinded: (isBinded) => set({ isBinded }),

    setUserId: (userId) => {
      saveStorageValue(LOCAL_STORAGE.USER_ID, userId);

      return set({ userId, isLogin: !!userId });
    },

    setUserName: (userName) => {
      saveStorageValue(LOCAL_STORAGE.USER_NAME, userName);

      return set({ userName });
    },

    isSaveLogIn: false,
    setIsSaveLogIn: (isSaveLogIn) => {
      localStorage.setItem(LOCAL_STORAGE.IS_SAVE_LOGIN, String(isSaveLogIn));

      return set({ isSaveLogIn });
    },

    isLogin: false,
  };
}, Object.is);
