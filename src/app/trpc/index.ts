import superjson from 'superjson';

import type { ApiRouter } from '@/routes/server';
import { useGlobalModalStore } from '@/stores';
import type { TRPCLink } from '@trpc/client';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';

export const trpc = createTRPCReact<ApiRouter>();

const errorHandlingLink: TRPCLink<ApiRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next: (value) => observer.next(value),
        error: (err) => {
          if (err instanceof TRPCClientError) {
            const { setIsEscapeErrorModalOpen } =
              useGlobalModalStore.getState();

            setIsEscapeErrorModalOpen(true);
          }
          observer.error(err);
        },
        complete: () => observer.complete(),
      });

      return unsubscribe;
    });
  };
};

export const trpcClient = trpc.createClient({
  links: [
    errorHandlingLink,
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});
