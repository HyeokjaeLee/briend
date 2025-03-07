'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SessionProvider } from 'next-auth/react';
import { type PropsWithChildren, use } from 'react';

import { firebase } from '@/configs/firebase';
import { persistOptions, queryClient } from '@/configs/query-client';
import { trpc, trpcClient } from '@/configs/trpc';
import { createSuspendedComponent } from '@/utils/client';

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
            {children}
            <ReactQueryDevtools buttonPosition="top-right" />
          </trpc.Provider>
        </PersistQueryClientProvider>
      </SessionProvider>
    );
  },
);
