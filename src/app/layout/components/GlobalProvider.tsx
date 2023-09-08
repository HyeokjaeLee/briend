'use client';

import { useBindChattingRoomMap } from '@/app/layout/hook/useBindChattingRoomMap';
import { Toast } from '@hyeokjaelee/pastime-ui';

import { useBindAuthStore } from '../hook/useBindAuthStore';
import { useBindDarkMode } from '../hook/useBindDarkMode';
import { useBindGlobalStore } from '../hook/useBindGlobalStore';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  useBindAuthStore();

  useBindChattingRoomMap();

  useBindGlobalStore();

  useBindDarkMode();

  return <Toast.Provider>{children}</Toast.Provider>;
};
