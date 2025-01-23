'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/th';
import 'dayjs/locale/vi';

import { SessionProvider } from 'next-auth/react';

import { type PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';

import { DEFAULT_COOKIES_OPTIONS, IS_CLIENT, QUERY_KEYS } from '@/constants';
import { customCookies } from '@/utils';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { OmitKeyof } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { PeerConnector } from './PeerConnector';
import { TrpcProvider } from './TrpcProvider';
import { FriendStoreMounter } from './_components/FriendStoreMounter';
import { GlobalEventListener } from './_components/GlobalEventListener';
import { HistoryObserver } from './_components/HistoryObserver';
import { PeerMessageReceiver } from './_components/PeerMessageReceiver';
import { initFirebase } from './_configs/initFirebase';
import { initQueryClient } from './_configs/initQueryClient';

initFirebase();

const queryClient = initQueryClient();

const persistOptions: OmitKeyof<PersistQueryClientOptions, 'queryClient'> = {
  persister: createSyncStoragePersister({
    storage: IS_CLIENT ? window.sessionStorage : null,
  }),
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.queryKey.includes(QUERY_KEYS.SESSION),
  },
};

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <TrpcProvider>
        <CookiesProvider
          cookies={customCookies}
          defaultSetOptions={DEFAULT_COOKIES_OPTIONS}
        >
          <HistoryObserver />
          <GlobalEventListener />
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
          >
            <FriendStoreMounter />
            <PeerConnector />
            <PeerMessageReceiver />
            {children}
          </PersistQueryClientProvider>
        </CookiesProvider>
      </TrpcProvider>
    </SessionProvider>
  );
};
