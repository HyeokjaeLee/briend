'use client';

import { SessionProvider } from 'next-auth/react';

import type { RefAttributes } from 'react';

import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';

import { HistorySession } from './HistorySession';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  return (
    <SessionProvider>
      <HistorySession />
      <Theme {...props} />
    </SessionProvider>
  );
};
