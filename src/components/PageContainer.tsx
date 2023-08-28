'use client';

import { Toast } from '@hyeokjaelee/pastime-ui';

interface PageContainerProps {
  children: React.ReactNode;
}
export const PageContainer = ({ children }: PageContainerProps) => (
  <Toast.Provider floatDirection="from-bottom">{children}</Toast.Provider>
);
