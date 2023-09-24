import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LOCAL_STORAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { parseCookie } from '@/utils';

export const useBindAuthStore = () => {
  const [setIsSaveLogIn, setUserId, setUserName, setProfileImage, setIsBinded] =
    useAuthStore(
      (state) => [
        state.setIsSaveLogIn,
        state.setUserId,
        state.setUserName,
        state.setProfileImage,
        state.setIsBinded,
      ],
      shallow,
    );

  useEffect(() => {
    const cookies = parseCookie(document.cookie);

    const getStorageValue = (key: LOCAL_STORAGE): string | null =>
      cookies.get(key) ?? localStorage.getItem(key);

    setIsSaveLogIn(
      localStorage.getItem(LOCAL_STORAGE.IS_SAVE_LOGIN) === 'true',
    );

    const userId = getStorageValue(LOCAL_STORAGE.USER_ID);
    console.log(3, localStorage.getItem(LOCAL_STORAGE.USER_NAME));
    if (userId) setUserId(userId);

    const userName = getStorageValue(LOCAL_STORAGE.USER_NAME);

    if (userName) setUserName(userName);

    const profileImage = getStorageValue(LOCAL_STORAGE.PROFILE_IMAGE);

    if (profileImage) setProfileImage(profileImage);

    setIsBinded(true);
  }, [setIsSaveLogIn, setProfileImage, setUserId, setUserName, setIsBinded]);
};
