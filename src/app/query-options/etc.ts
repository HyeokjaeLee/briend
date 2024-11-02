import ky from 'ky';

import { createQueryKeys } from '@/utils/createQueryKeys';
import { queryOptions } from '@tanstack/react-query';

export namespace EtcQueryOptionsParams {
  export interface Qr {
    size: number;
    href: string;
  }
}

export const EtcQueryKey = createQueryKeys('etc', ['Qr'] as const);
// Start of Selection
export const EtcQueryOptions = {
  qr: ({ href, size }: EtcQueryOptionsParams.Qr) =>
    queryOptions({
      queryKey: [EtcQueryKey.Qr, href, size],
      queryFn: async () => {
        const url = new URL('https://api.qrserver.com/v1/create-qr-code');

        url.searchParams.set('size', `${size}x${size}`);
        url.searchParams.set('data', href);

        const res = await ky.get(url.href);

        const blob = await res.blob();

        return blob;
      },
    }),
};
