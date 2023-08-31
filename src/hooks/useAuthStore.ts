import { createWithEqualityFn } from 'zustand/traditional';

enum LOCAL_STORAGE_KEY {
  USER_ID = 'user-id',
  USER_NAME = 'user-name',
  PROFILE_IMAGE = 'profile-image',
  IS_SAVE_LOGIN = 'is-save-login',
}

interface AuthStore {
  userId: string | null;
  setUserId: (userId: string | null) => void;

  userName: string | null;
  setUserName: (userName: string | null) => void;

  profileImage: string | null;
  setProfileImage: (profileImage: string | null) => void;

  isSaveLogin: boolean;
  setIsSaveLogin: (isLoginInfo: boolean) => void;

  isLogin: () => boolean;
}

export const useAuthStore = createWithEqualityFn<AuthStore>((set, get) => {
  const userId = localStorage?.getItem(LOCAL_STORAGE_KEY.USER_ID);
  const userName = localStorage?.getItem(LOCAL_STORAGE_KEY.USER_NAME);
  const profileImage = localStorage?.getItem(LOCAL_STORAGE_KEY.PROFILE_IMAGE);
  const saveLogin = localStorage?.getItem(LOCAL_STORAGE_KEY.IS_SAVE_LOGIN);

  return {
    userId,
    setUserId: (userId) => {
      const { isSaveLogin } = get();
      if (!isSaveLogin && userId)
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, userId);
      else localStorage.removeItem(LOCAL_STORAGE_KEY.USER_ID);
      return set({ userId });
    },

    userName,
    setUserName: (userName) => {
      const { isSaveLogin } = get();
      if (!isSaveLogin && userName)
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_NAME, userName);
      else localStorage.removeItem(LOCAL_STORAGE_KEY.USER_NAME);
      return set({ userName });
    },

    profileImage,
    setProfileImage: (profileImage) => {
      const { isSaveLogin } = get();
      if (!isSaveLogin && profileImage)
        localStorage.setItem(LOCAL_STORAGE_KEY.PROFILE_IMAGE, profileImage);
      else localStorage.removeItem(LOCAL_STORAGE_KEY.PROFILE_IMAGE);
      return set({ profileImage });
    },

    isSaveLogin: saveLogin ? JSON.parse(saveLogin) : true,
    setIsSaveLogin: (isSaveLogin) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.IS_SAVE_LOGIN,
        String(isSaveLogin),
      );
      return set({ isSaveLogin });
    },

    isLogin: () => {
      const { userId, userName } = get();

      return !!(userId && userName);
    },
  };
}, Object.is);
