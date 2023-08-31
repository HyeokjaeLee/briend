'use client';

import { useCheckLogin } from '@/hooks';
import { Toast } from '@hyeokjaelee/pastime-ui';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  useCheckLogin();
  return <Toast.Provider>{children}</Toast.Provider>;
};
