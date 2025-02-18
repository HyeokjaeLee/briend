import type { QueryKey } from '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesIfHasAll?: Array<QueryKey>;
      resetsIfHasAll?: Array<QueryKey>;
    };
  }
}

declare module 'dexie-react-hooks' {
  export function useLiveQuery<T>(
    querier: () => Promise<T> | T | undefined,
    deps?: any[],
  ): T | undefined;
  export function useLiveQuery<T, TDefault>(
    querier: () => Promise<T> | T | undefined,

    deps: any[],
    defaultResult: TDefault,
  ): T | TDefault;
}
