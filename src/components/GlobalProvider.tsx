'use client';

import { useBindAuthStore } from '@/hooks/useBindAuthStore';
import { useBindChattingRoomStore } from '@/hooks/useBindChattingRoomStore';
import { useBindDarkMode } from '@/hooks/useBindDarkMode';
import { usePathAccessController } from '@/hooks/usePathAccessController';
import { Toast } from '@hyeokjaelee/pastime-ui';

import { ChattingHistoryModal } from './ChattingHistoryModal';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const { isAuthBined } = useBindAuthStore();

  usePathAccessController(isAuthBined);

  useBindChattingRoomStore();

  useBindDarkMode();

  return (
    <Toast.Provider>
      {children}
      <ChattingHistoryModal />
    </Toast.Provider>
  );
};
