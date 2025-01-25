import superjson from 'superjson';

import { trpc } from '@/app/trpc/client';
import { httpBatchLink } from '@trpc/client';

export const initTrpc = () =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
      }),
    ],
  });
