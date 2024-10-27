'use client';

import { SessionProvider } from 'next-auth/react';

import type { RefAttributes } from 'react';
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
