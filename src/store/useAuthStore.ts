import { createWithEqualityFn } from 'zustand/traditional';

import { LOCAL_STORAGE } from '@/constants';
import { ChattingRoom } from '@/types';
import { naming } from '@/utils/naming';

type ChattingRoomMap = Map<string, ChattingRoom>;
interface AuthStore {
  isBinded: boolean;
  setIsBinded: (isBinded: boolean) => void;

  userId?: string | null;
  setUserId: (userId: string | null) => void;

  userName?: string | null;
  setUserName: (userName: string | null) => void;

  profileImage?: string | null;
  setProfileImage: (profileImage: string | null) => void;

  isSaveLogIn: boolean;
  setIsSaveLogIn: (isLoginInfo: boolean) => void;

  chattingRoomMap: ChattingRoomMap;
  setChattingRoomMap: (
    chattingRoomMap:
      | ChattingRoomMap
      | ((chattingRoomMap: ChattingRoomMap) => ChattingRoomMap),
  ) => void;

  isLogin: boolean;
}

export const useAuthStore = createWithEqualityFn<AuthStore>((set, get) => {
  const saveStorageValue = (key: LOCAL_STORAGE, value: string | null) => {
    const { isSaveLogIn } = get();

    if (isSaveLogIn && value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);

    if (value) {
      if (isSaveLogIn) localStorage.setItem(key, value);

      document.cookie = `${key}=${value}; path=/;`;
    } else document.cookie = `${key}=; path=/;`;

    if (!value || !isSaveLogIn) localStorage.removeItem(key);
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

    setProfileImage: (profileImage) => {
      saveStorageValue(LOCAL_STORAGE.PROFILE_IMAGE, profileImage);

      return set({ profileImage });
    },

    isSaveLogIn: false,
    setIsSaveLogIn: (isSaveLogIn) => {
      localStorage.setItem(LOCAL_STORAGE.IS_SAVE_LOGIN, String(isSaveLogIn));

      return set({ isSaveLogIn });
    },

    chattingRoomMap: new Map(),
    setChattingRoomMap: (chattingRoomMap) => {
      const { userId, chattingRoomMap: prevChattingRoomMap } = get();

      const newChattingRoomMap =
        typeof chattingRoomMap === 'function'
          ? chattingRoomMap(prevChattingRoomMap)
          : chattingRoomMap;

      localStorage.setItem(
        naming.chattingTokenList(userId ?? 'guest'),
        JSON.stringify([...newChattingRoomMap.keys()]),
      );

      return set({ chattingRoomMap: newChattingRoomMap });
    },

    isLogin: false,
  };
}, Object.is);
