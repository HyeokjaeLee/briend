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
import { type PropsWithChildren, use, useEffect } from 'react';

import { firebase } from '@/configs/firebase';
import { persistOptions, queryClient } from '@/configs/query-client';
import { trpc, trpcClient } from '@/configs/trpc';
import { createSuspendedComponent } from '@/utils/client';

export const GlobalProvider = createSuspendedComponent(
  ({ children }: PropsWithChildren) => {
    use(firebase);

    useEffect(() => {
      if (
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        window.location.protocol === 'https:'
      ) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.info(
              'Service Worker registered with scope:',
              registration.scope,
            );
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }, []);

    return (
      <SessionProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
            <ReactQueryDevtools buttonPosition="top-left" />
          </trpc.Provider>
        </PersistQueryClientProvider>
      </SessionProvider>
    );
  },
);
