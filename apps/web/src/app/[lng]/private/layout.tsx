'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type PropsWithChildren, useEffect } from 'react';

import { PageLoadingTemplate } from '@/components';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';

export default function PrivateLayout({ children }: PropsWithChildren) {
  const { status } = useSession();
  const router = useCustomRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      const loginUrl = ROUTES.LOGIN.url({});

      // 로그인 후 원래 페이지로 돌아오기 위해 callbackUrl 추가
      loginUrl.searchParams.set('callbackUrl', pathname);
      router.replace(loginUrl.href.replace(loginUrl.origin, ''));
    }
  }, [status, router, pathname]);

  if (status === 'authenticated') {
    return children;
  }

  return <PageLoadingTemplate />;
}
