import { queryOptions } from '@tanstack/react-query';

import { IS_DEV } from '@/constants';
import { API_ROUTES } from '@/routes/api';
import { assert, createQueryKeys } from '@/utils';

export const UtilsQueryKey = createQueryKeys('utils', ['shortUrl'] as const);

export const UtilsQueryOptions = {
  shortUrl: (url: string) =>
    queryOptions({
      queryKey: [UtilsQueryKey.shortUrl, url],
      //! 해당 api는 http 프로토콜을 지원하지 않음
      queryFn: async () => {
        if (IS_DEV) return url;
        const res = API_ROUTES.POST_SHORT_URL(url);

        const { short_url: shortUrl } = await res.json();

        assert(shortUrl);

        return shortUrl;
      },
      retry: false,
    }),
};
