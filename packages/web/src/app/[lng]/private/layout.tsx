'use client';

import { type PropsWithChildren } from 'react';

import { PageLoadingTemplate } from '@/components';
import { useUserData } from '@/hooks';

export default function PrivateLayout({ children }: PropsWithChildren) {
  const { isLogin } = useUserData();

  if (!isLogin) return <PageLoadingTemplate />;

  return children;
}
