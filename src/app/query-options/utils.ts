import { QUERY_KEYS, IS_DEV } from '@/constants';
import { API_ROUTES } from '@/routes/api';
import { createQueryKeys } from '@/utils';
import { queryOptions } from '@tanstack/react-query';

export const UtilsQueryKey = createQueryKeys('utils', ['shortUrl'] as const);

export const UtilsQueryOptions = {
  shortUrl: (url: string) =>
    queryOptions({
      queryKey: [UtilsQueryKey.shortUrl, url, QUERY_KEYS.SESSION],
      //! 해당 api는 http 프로토콜을 지원하지 않음
      queryFn: () => (IS_DEV ? url : API_ROUTES.SHORT_URL(url)),
      retry: false,
    }),
};
