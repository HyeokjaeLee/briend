'use client';

import { SessionProvider } from 'next-auth/react';

import { type RefAttributes } from 'react';
import { CookiesProvider } from 'react-cookie';

import { cookies, DEFAULT_COOKIES_OPTIONS } from '@/stores/cookies';
import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GlobalEventListener } from './GlobalEventListener';
import { HistoryObserver } from './HistoryObserver';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <CookiesProvider
        cookies={cookies}
        defaultSetOptions={DEFAULT_COOKIES_OPTIONS}
      >
        <HistoryObserver />
        <GlobalEventListener />
        <QueryClientProvider client={queryClient}>
          <Theme {...props} />
        </QueryClientProvider>
      </CookiesProvider>
    </SessionProvider>
  );
};
