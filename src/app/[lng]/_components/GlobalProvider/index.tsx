'use client';

import { SessionProvider } from 'next-auth/react';

import { type RefAttributes } from 'react';
import { CookiesProvider } from 'react-cookie';

import { IS_DEV } from '@/constants/public-env';
import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CookiesSync } from './CookiesSync';
import { GlobalStoreSync } from './GlobalStoreSync';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <Theme {...props} />
        </QueryClientProvider>
      </CookiesProvider>
    </SessionProvider>
  );
};
