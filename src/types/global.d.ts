import type { QueryKey } from '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesIfHasAll?: Array<QueryKey>;
      resetsIfHasAll?: Array<QueryKey>;
    };
  }
}
