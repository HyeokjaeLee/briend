'use client';

import { useEffect, useState } from 'react';

const SAVE_INFO_KEY = 'save-login-info';

export const useSaveLoginInfoState = () => {
  const [isSaveInfo, setIsSaveInfo] = useState(true);

  useEffect(() => {
    const saveInfoOfLocalStorage = localStorage.getItem(SAVE_INFO_KEY);
    if (saveInfoOfLocalStorage) {
      const saveInfo: boolean = JSON.parse(saveInfoOfLocalStorage);
      setIsSaveInfo(saveInfo);
    }
  }, []);

  return [
    isSaveInfo,
    (saveInfo: boolean) => {
      localStorage.setItem(SAVE_INFO_KEY, JSON.stringify(saveInfo));
      setIsSaveInfo(saveInfo);
    },
  ] as const;
};
