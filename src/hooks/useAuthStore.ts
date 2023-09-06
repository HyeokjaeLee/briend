import { createWithEqualityFn } from 'zustand/traditional';

import { LOCAL_STORAGE } from '@/constants';

interface AuthStore {
  userId?: string | null;
  setUserId: (userId: string | null) => void;

  userName?: string | null;
  setUserName: (userName: string | null) => void;

  profileImage?: string | null;
  setProfileImage: (profileImage: string | null) => void;

  isSaveLogin: boolean;
  setIsSaveLogin: (isLoginInfo: boolean) => void;

  isLogin: boolean;
}

export const useAuthStore = createWithEqualityFn<AuthStore>((set, get) => {
  const saveStorageValue = (key: LOCAL_STORAGE, value: string | null) => {
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
    setUserId: (userId) => {
      saveStorageValue(LOCAL_STORAGE.USER_ID, userId);

      return set({ userId, isLogin: !!userId });
    },

    setUserName: (userName) => {
      saveStorageValue(LOCAL_STORAGE.USER_NAME, userName);

      return set({ userName });
    },

    setProfileImage: (profileImage) => {
      saveStorageValue(LOCAL_STORAGE.PROFILE_IMAGE, profileImage);

      return set({ profileImage });
    },

    isSaveLogin: false,
    setIsSaveLogin: (isSaveLogin) => {
      localStorage.setItem(LOCAL_STORAGE.IS_SAVE_LOGIN, String(isSaveLogin));

      return set({ isSaveLogin });
    },

    isLogin: false,
  };
}, Object.is);
