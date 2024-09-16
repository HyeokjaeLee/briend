'use client';

import { SessionProvider } from 'next-auth/react';

import { Suspense, type RefAttributes } from 'react';

import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';

import { HistoryObserver } from './HistoryObserver';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  return (
    <SessionProvider>
      <Suspense>
        <HistoryObserver />
      </Suspense>
      <Theme {...props} />
    </SessionProvider>
  );
};
