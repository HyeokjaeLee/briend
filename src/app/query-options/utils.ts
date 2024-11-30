import { QUERY_KEYS } from '@/constants/etc';
import { API_ROUTES } from '@/routes/api';
import { createQueryKeys } from '@/utils/createQueryKeys';
import { queryOptions } from '@tanstack/react-query';

export const UtilsQueryKey = createQueryKeys('utils', ['shortUrl'] as const);

export const UtilsQueryOptions = {
  shortUrl: (url: string) =>
    queryOptions({
      queryKey: [UtilsQueryKey.shortUrl, url, QUERY_KEYS.SESSION],
      queryFn: () => API_ROUTES.SHORT_URL(url),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
