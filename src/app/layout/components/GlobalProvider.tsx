'use client';

import { Toast } from '@hyeokjaelee/pastime-ui';

import { useBindAuthStore } from '../hook/useBindAuthStore';
import { useBindDarkMode } from '../hook/useBindDarkMode';
import { useBindGlobalStore } from '../hook/useBindGlobalStore';
import { useMountChattingDataStore } from '../hook/useMountChattingDataStore';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  useBindAuthStore();

  useBindGlobalStore();

  useBindDarkMode();

  useMountChattingDataStore();

  return <Toast.Provider>{children}</Toast.Provider>;
};
