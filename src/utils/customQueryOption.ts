import { nanoid } from 'nanoid';

import {
  queryOptions,
  type UnusedSkipTokenOptions,
} from '@tanstack/react-query';

export const customQueryOption = <
  TParams extends undefined | object,
  TResult,
  TSelect = TResult,
>(
  callback: (
    params: TParams,
  ) => Omit<
    UnusedSkipTokenOptions<TResult, Error, TSelect, string[]>,
    'queryKey'
  > & { queryKey?: string[] },
) => {
  const uniqueQueryKey = nanoid();

  return <TNewSelect = TSelect>(
    params?: TParams,
    options?: Omit<
      UnusedSkipTokenOptions<TResult, Error, TNewSelect, string[]>,
      'queryFn' | 'queryKey'
    >,
  ) => {
    const commonQueryOptionParams = callback(params as TParams);

    const queryKey: string[] = [uniqueQueryKey];

    if (commonQueryOptionParams.queryKey)
      queryKey.push(...commonQueryOptionParams.queryKey);

    if (params) queryKey.push(...Object.values(params));

    const queryOptionParams = {
      ...commonQueryOptionParams,
      queryKey,
      ...options,
    } as UnusedSkipTokenOptions<TResult, Error, TNewSelect>;

    return queryOptions(queryOptionParams);
  };
};
