import { useEffect, useState } from 'react';

import { parseCookie } from '@/utils';

const ACTIVE_WINDOW_COOKIE = 'active-windows';

export const useCheckMultiWindows = () => {
  const [isMultiWindows, setIsMultiWindows] = useState(false);
  useEffect(() => {
    const getActiveWindowCount = () =>
      Number(parseCookie(document.cookie).get(ACTIVE_WINDOW_COOKIE) ?? 0);

    const currentCount = getActiveWindowCount() + 1;

    document.cookie = `${ACTIVE_WINDOW_COOKIE}=${currentCount}; path=/;`;

    window.addEventListener('beforeunload', () => {
      document.cookie = `${ACTIVE_WINDOW_COOKIE}=${
        getActiveWindowCount() - 1
      }; path=/;`;
    });

    if (currentCount > 1) {
      setIsMultiWindows(true);

      const checkMultiWindowsInterval = setInterval(() => {
        const currentCount = getActiveWindowCount();

        if (currentCount < 2) {
          setIsMultiWindows(false);
          clearInterval(checkMultiWindowsInterval);
        }
      }, 3_000);

      return () => clearInterval(checkMultiWindowsInterval);
    }
  }, []);

  return { isMultiWindows };
};
