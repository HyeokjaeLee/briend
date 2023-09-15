'use client';

import { Toast } from '@hyeokjaelee/pastime-ui';

import { useBindAuthStore } from '../hook/useBindAuthStore';
import { useBindDarkMode } from '../hook/useBindDarkMode';
import { useBindGlobalStore } from '../hook/useBindGlobalStore';
import { useMountChattingRoomIndexDBStore } from '../hook/useMountIndexedDB';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  useBindAuthStore();

  useBindGlobalStore();

  useBindDarkMode();

  useMountChattingRoomIndexDBStore();

  return <Toast.Provider>{children}</Toast.Provider>;
};
