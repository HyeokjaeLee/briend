import { MutationCache, QueryClient } from '@tanstack/react-query';

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

  return queryClient;
};
