'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { SessionProvider } from 'next-auth/react';

import type { PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';

import { trpc } from '@/app/trpc/client';
import { DEFAULT_COOKIES_OPTIONS } from '@/constants';
import { customCookies } from '@/utils';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { PeerConnector } from './PeerConnector';
import { FriendStoreMounter } from './_components/FriendStoreMounter';
import { GlobalEventListener } from './_components/GlobalEventListener';
import { HistoryObserver } from './_components/HistoryObserver';
import { PeerMessageReceiver } from './_components/PeerMessageReceiver';
import { initFirebase } from './_configs/initFirebase';
import { initQueryClient } from './_configs/initQueryClient';
import { initTrpc } from './_configs/initTrpc';

initFirebase();
const trpcClient = initTrpc();
const { persistOptions, queryClient } = initQueryClient();

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <CookiesProvider
        cookies={customCookies}
        defaultSetOptions={DEFAULT_COOKIES_OPTIONS}
      >
        <HistoryObserver />
        <GlobalEventListener />
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
          >
            <FriendStoreMounter />
            <PeerConnector />
            <PeerMessageReceiver />
            {children}
          </PersistQueryClientProvider>
        </trpc.Provider>
      </CookiesProvider>
    </SessionProvider>
  );
};
