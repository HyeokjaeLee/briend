'use client';

import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore, usePathAccessController } from '@/hooks';
import { Toast } from '@hyeokjaelee/pastime-ui';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [bindAuthStoreFromLocalStorage, isBinded, isLogin] = useAuthStore(
    (state) => [
      state.bindAuthStoreFromLocalStorage,
      state.isBinded,
      state.isLogin,
    ],
    shallow,
  );

  usePathAccessController({
    isBinded,
    isLogin,
  });

  useEffect(
    () => bindAuthStoreFromLocalStorage(),
    [bindAuthStoreFromLocalStorage],
  );

  return <Toast.Provider>{children}</Toast.Provider>;
};
