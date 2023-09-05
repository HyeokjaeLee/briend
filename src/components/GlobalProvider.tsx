'use client';

import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useChattingStore } from '@/hooks/useChattingStore';
import { usePathAccessController } from '@/hooks/usePathAccessController';
import { Toast } from '@hyeokjaelee/pastime-ui';

import { ChattingHistoryModal } from './ChattingHistoryModal';

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

  const bindChattingStoreFromLocalStorage = useChattingStore(
    (state) => state.bindChattingStoreFromLocalStorage,
    shallow,
  );

  useEffect(
    () => bindChattingStoreFromLocalStorage(),
    [bindChattingStoreFromLocalStorage],
  );

  useEffect(
    () => bindAuthStoreFromLocalStorage(),
    [bindAuthStoreFromLocalStorage],
  );

  return (
    <Toast.Provider>
      {children}
      <ChattingHistoryModal />
    </Toast.Provider>
  );
};
