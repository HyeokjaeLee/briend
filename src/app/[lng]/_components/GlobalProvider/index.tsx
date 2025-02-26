'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SessionProvider } from 'next-auth/react';
import { type PropsWithChildren, use } from 'react';

import { trpc, trpcClient } from '@/app/trpc';
import { createSuspendedComponent } from '@/utils/client';

import { GlobalListener } from './_components/GlobalListener';
import { firebase } from './_configs/initFirebase';
import { initQueryClient } from './_configs/initQueryClient';

const { persistOptions, queryClient } = initQueryClient();

export const GlobalProvider = createSuspendedComponent(
  ({ children }: PropsWithChildren) => {
    use(firebase);

    return (
      <SessionProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <GlobalListener />
            {children}
          </trpc.Provider>
        </PersistQueryClientProvider>
      </SessionProvider>
    );
  },
);
