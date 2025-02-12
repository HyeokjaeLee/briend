'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { SessionProvider } from 'next-auth/react';

import { use, type PropsWithChildren } from 'react';

import { trpc, trpcClient } from '@/app/trpc';
import { createSuspensedComponent } from '@/utils/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { GlobalEventListener } from './_components/GlobalEventListener';
import { GlobalFireStoreSubscription } from './_components/GlobalFireStoreSubscription';
import { HistoryObserver } from './_components/HistoryObserver';
import { firebase } from './_configs/initFirebase';
import { initQueryClient } from './_configs/initQueryClient';

const { persistOptions, queryClient } = initQueryClient();

export const GlobalProvider = createSuspensedComponent(
  ({ children }: PropsWithChildren) => {
    use(firebase);

    return (
      <SessionProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <GlobalFireStoreSubscription />
            <HistoryObserver />
            <GlobalEventListener />
            {children}
          </trpc.Provider>
        </PersistQueryClientProvider>
      </SessionProvider>
    );
  },
);
