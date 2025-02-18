import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { OmitKeyof } from '@tanstack/react-query';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import { IS_CLIENT,QUERY_KEYS } from '@/constants';

export const initQueryClient = () => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        const { invalidatesIfHasAll, resetsIfHasAll } = mutation.meta ?? {};

        if (invalidatesIfHasAll)
          queryClient.invalidateQueries({
            predicate: (query) =>
              invalidatesIfHasAll.some((invalidate) =>
                invalidate.every((key) => query.queryKey.includes(key)),
              ),
          });

        if (resetsIfHasAll)
          queryClient.invalidateQueries({
            predicate: (query) =>
              resetsIfHasAll.some((reset) =>
                reset.every((key) => query.queryKey.includes(key)),
              ),
          });
      },
    }),
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1_000,
        staleTime: 30 * 1_000,
      },
    },
  });

  //* 🛠️ 캐시 세션 스토리지에 저장
  const persistOptions: OmitKeyof<PersistQueryClientOptions, 'queryClient'> = {
    persister: createSyncStoragePersister({
      storage: IS_CLIENT ? window.sessionStorage : null,
    }),
    dehydrateOptions: {
      shouldDehydrateQuery: (query) =>
        !query.queryKey.includes(QUERY_KEYS.NOT_SESSION),
    },
  };

  return {
    queryClient,
    persistOptions,
  };
};
