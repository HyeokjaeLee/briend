import { useEffect } from 'react';

import { LOCAL_STORAGE } from '@/constants';
import { isServerSide } from '@/utils';

export const useBindDarkMode = () => {
  useEffect(() => {
    if (isServerSide()) return;

    const isDarkMode = (() => {
      if (isServerSide()) return false;

      const localStorageDarkModeString = localStorage.getItem(
        LOCAL_STORAGE.DARK_MODE,
      );

      if (localStorageDarkModeString)
        return JSON.parse(localStorageDarkModeString);

      const isDeviceDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;

      return isDeviceDarkMode;
    })();

    if (isDarkMode) document.documentElement.classList.add('dark');
  }, []);
};
