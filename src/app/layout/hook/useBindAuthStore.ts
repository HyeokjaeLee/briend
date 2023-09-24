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
    console.log(1, cookies);
    const getStorageValue = (key: LOCAL_STORAGE) =>
      cookies.get(key) ?? localStorage.getItem(key);

    setIsSaveLogIn(
      localStorage.getItem(LOCAL_STORAGE.IS_SAVE_LOGIN) === 'true',
    );
    console.log(
      2,
      localStorage.getItem(LOCAL_STORAGE.IS_SAVE_LOGIN) === 'true',
    );

    setUserId(getStorageValue(LOCAL_STORAGE.USER_ID));

    console.log(3, getStorageValue(LOCAL_STORAGE.USER_ID));

    setUserName(getStorageValue(LOCAL_STORAGE.USER_NAME));

    console.log(4, getStorageValue(LOCAL_STORAGE.USER_NAME));

    setProfileImage(getStorageValue(LOCAL_STORAGE.PROFILE_IMAGE));

    console.log(5, getStorageValue(LOCAL_STORAGE.PROFILE_IMAGE));

    setIsBinded(true);
  }, [setIsSaveLogIn, setProfileImage, setUserId, setUserName, setIsBinded]);
};
