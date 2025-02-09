'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { SessionProvider } from 'next-auth/react';

import { use, type PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';

import { trpc, trpcClient } from '@/app/trpc';
import { DEFAULT_COOKIES_OPTIONS } from '@/constants';
import { customCookies } from '@/utils';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { GlobalEventListener } from './_components/GlobalEventListener';
import { HistoryObserver } from './_components/HistoryObserver';
import { firebase } from './_configs/initFirebase';
import { initQueryClient } from './_configs/initQueryClient';

const { persistOptions, queryClient } = initQueryClient();

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  use(firebase);

  return (
    <SessionProvider>
      <CookiesProvider
        cookies={customCookies}
        defaultSetOptions={DEFAULT_COOKIES_OPTIONS}
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
          >
            <HistoryObserver />
            <GlobalEventListener />
            {children}
          </PersistQueryClientProvider>
        </trpc.Provider>
      </CookiesProvider>
    </SessionProvider>
  );
};
