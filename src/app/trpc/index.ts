import { getAuth } from 'firebase/auth';
import superjson from 'superjson';

import { IS_CLIENT, PATH, PUBLIC_ENV } from '@/constants';
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
      url: IS_CLIENT ? PATH.TRPC : PUBLIC_ENV.BASE_URL + PATH.TRPC,
      transformer: superjson,
      async headers() {
        let firebaseIdToken: string | undefined;

        if (IS_CLIENT) {
          const auth = getAuth();

          firebaseIdToken = await auth.currentUser?.getIdToken();
        }

        return {
          firebaseIdToken,
          isClient: String(IS_CLIENT),
        };
      },
    }),
  ],
});
