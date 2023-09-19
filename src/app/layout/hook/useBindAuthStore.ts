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

    const getStorageValue = (key: LOCAL_STORAGE) =>
      cookies.get(key) ?? localStorage.getItem(key);

    setIsSaveLogIn(
      localStorage.getItem(LOCAL_STORAGE.IS_SAVE_LOGIN) === 'true',
    );
    setUserId(getStorageValue(LOCAL_STORAGE.USER_ID));
    setUserName(getStorageValue(LOCAL_STORAGE.USER_NAME));
    setProfileImage(getStorageValue(LOCAL_STORAGE.PROFILE_IMAGE));

    setIsBinded(true);
  }, [setIsSaveLogIn, setProfileImage, setUserId, setUserName, setIsBinded]);
};
