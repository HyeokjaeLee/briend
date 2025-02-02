import superjson from 'superjson';

import type { ApiRouter } from '@/routes/server';
import { useGlobalModalStore } from '@/stores';
import { ERROR_CODE } from '@/utils';
import type { TRPCLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';

export const trpc = createTRPCReact<ApiRouter>();

const errorHandlingLink: TRPCLink<ApiRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next: (value) => observer.next(value),
        error: (err) => {
          let isUnknownError = true;

          if (err instanceof Error) {
            const codeMatch = err.message.match(/<([^>]+)>/);
            const errorCode = codeMatch?.[1] ?? null;

            isUnknownError = !Object.values(ERROR_CODE).includes(
              Number(errorCode),
            );
          }

          if (isUnknownError) {
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
