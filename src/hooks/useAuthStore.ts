import { createWithEqualityFn } from 'zustand/traditional';

import { parseCookie } from '@/utils';

enum STORAGE_KEY {
  USER_ID = 'user-id',
  USER_NAME = 'user-name',
  PROFILE_IMAGE = 'profile-image',
  IS_SAVE_LOGIN = 'is-save-login',
}

interface AuthStore {
  isBinded: boolean;
  bindAuthStoreFromLocalStorage: () => void;

  userId: string | null;
  setUserId: (userId: string | null) => void;

  userName: string | null;
  setUserName: (userName: string | null) => void;

  profileImage: string | null;
  setProfileImage: (profileImage: string | null) => void;

  isSaveLogin: boolean;
  setIsSaveLogin: (isLoginInfo: boolean) => void;

  isLogin: boolean;
}

export const useAuthStore = createWithEqualityFn<AuthStore>((set, get) => {
  const saveStorageValue = (key: STORAGE_KEY, value: string | null) => {
    const { isSaveLogin } = get();

    if (isSaveLogin && value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);

    if (value) {
      if (isSaveLogin) localStorage.setItem(key, value);

      document.cookie = `${key}=${value}; path=/;`;
    } else document.cookie = `${key}=; path=/;`;

    if (!value || !isSaveLogin) localStorage.removeItem(key);
  };

  return {
    isBinded: false,
    bindAuthStoreFromLocalStorage: () => {
      const { isBinded } = get();

      if (isBinded) return;

      const cookies = parseCookie(document.cookie);

      const saveLogin = localStorage.getItem(STORAGE_KEY.IS_SAVE_LOGIN);

      const getStorageValue = (key: STORAGE_KEY) =>
        cookies.get(key) ?? localStorage.getItem(key);

      const userId = getStorageValue(STORAGE_KEY.USER_ID);

      return set({
        userId,
        userName: getStorageValue(STORAGE_KEY.USER_NAME),
        profileImage: getStorageValue(STORAGE_KEY.PROFILE_IMAGE),
        isSaveLogin: saveLogin ? JSON.parse(saveLogin) : true,
        isBinded: true,
        isLogin: !!userId,
      });
    },

    userId: null,
    setUserId: (userId) => {
      saveStorageValue(STORAGE_KEY.USER_ID, userId);

      return set({ userId, isLogin: !!userId });
    },

    userName: null,
    setUserName: (userName) => {
      saveStorageValue(STORAGE_KEY.USER_NAME, userName);

      return set({ userName });
    },

    profileImage: null,
    setProfileImage: (profileImage) => {
      saveStorageValue(STORAGE_KEY.PROFILE_IMAGE, profileImage);

      return set({ profileImage });
    },

    isSaveLogin: true,
    setIsSaveLogin: (isSaveLogin) => {
      localStorage.setItem(STORAGE_KEY.IS_SAVE_LOGIN, String(isSaveLogin));

      return set({ isSaveLogin });
    },

    isLogin: false,
  };
}, Object.is);
