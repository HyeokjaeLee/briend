import { shallow } from 'zustand/shallow';

import { useEffect, useState } from 'react';

import { LOCAL_STORAGE } from '@/constants';
import { isServerSide, parseCookie } from '@/utils';

import { useAuthStore } from './useAuthStore';

export const useBindAuthStore = () => {
  const [isBinded, setIsBinded] = useState(false);

  const [setIsSaveLogin, setUserId, setUserName, setProfileImage] =
    useAuthStore(
      (state) => [
        state.setIsSaveLogin,
        state.setUserId,
        state.setUserName,
        state.setProfileImage,
      ],
      shallow,
    );

  useEffect(() => {
    if (isServerSide()) return;

    const cookies = parseCookie(document.cookie);

    const getStorageValue = (key: LOCAL_STORAGE) =>
      cookies.get(key) ?? localStorage.getItem(key);

    setIsSaveLogin(
      localStorage.getItem(LOCAL_STORAGE.IS_SAVE_LOGIN) === 'true',
    );
    setUserId(getStorageValue(LOCAL_STORAGE.USER_ID));
    setUserName(getStorageValue(LOCAL_STORAGE.USER_NAME));
    setProfileImage(getStorageValue(LOCAL_STORAGE.PROFILE_IMAGE));

    setIsBinded(true);
  }, [setIsSaveLogin, setProfileImage, setUserId, setUserName]);

  return { isAuthBined: isBinded };
};
