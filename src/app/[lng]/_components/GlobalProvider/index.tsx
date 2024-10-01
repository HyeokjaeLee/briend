'use client';

import { SessionProvider } from 'next-auth/react';

import { Suspense, type RefAttributes } from 'react';
import { CookiesProvider } from 'react-cookie';

import { IS_DEV } from '@/constants/public-env';
import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';

import { HistoryObserver } from './HistoryObserver';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  return (
    <SessionProvider>
      <CookiesProvider
        defaultSetOptions={{
          httpOnly: !IS_DEV,
          secure: !IS_DEV,
          path: '/',
        }}
      >
        <Suspense>
          <HistoryObserver />
        </Suspense>
        <Theme {...props} />
      </CookiesProvider>
    </SessionProvider>
  );
};
