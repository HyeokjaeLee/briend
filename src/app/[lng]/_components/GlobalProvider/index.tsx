'use client';

import { throttle } from 'es-toolkit';
import { SessionProvider } from 'next-auth/react';

import { useLayoutEffect, type RefAttributes } from 'react';
import { CookiesProvider } from 'react-cookie';

import { IS_DEV } from '@/constants/public-env';
import { useHistoryStore } from '@/stores/history';
import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CookiesSync } from './CookiesSync';
import { GlobalStoreSync } from './GlobalStoreSync';
import { HistoryObserver } from './HistoryObserver';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  const queryClient = new QueryClient();

  useHistoryStore();

  useLayoutEffect(() => {
    const updateHeight = throttle(() => {
      const height = window.visualViewport?.height || window.innerHeight;

      document.documentElement.style.setProperty(
        '--viewport-height',
        `${height}px`,
      );
    }, 33);

    updateHeight();

    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <SessionProvider>
      <CookiesProvider
        defaultSetOptions={{
          httpOnly: !IS_DEV,
          secure: !IS_DEV,
          path: '/',
        }}
      >
        <CookiesSync />
        <GlobalStoreSync />
        <HistoryObserver />
        <QueryClientProvider client={queryClient}>
          <Theme {...props} />
        </QueryClientProvider>
      </CookiesProvider>
    </SessionProvider>
  );
};
