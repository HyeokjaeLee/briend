import { nanoid } from 'nanoid';

import {
  queryOptions,
  type UnusedSkipTokenOptions,
} from '@tanstack/react-query';

export const customQueryOption = <TParams extends undefined | object, TResult>(
  callback: (
    params: TParams,
  ) => Omit<
    UnusedSkipTokenOptions<TResult, Error, TResult, string[]>,
    'queryKey'
  > & { queryKey?: string[] },
) => {
  const uniqueQueryKey = nanoid();

  return (
    params?: TParams,
    options?: Omit<
      UnusedSkipTokenOptions<TResult, Error, TResult, string[]>,
      'queryFn' | 'queryKey'
    >,
  ) => {
    const commonQueryOptionParams = callback(params as TParams);

    const queryKey: string[] = [uniqueQueryKey];

    if (commonQueryOptionParams.queryKey)
      queryKey.push(...commonQueryOptionParams.queryKey);

    if (params) queryKey.push(...Object.values(params));

    let queryOptionParams = {
      ...commonQueryOptionParams,
      queryKey,
    };

    if (options) {
      queryOptionParams = {
        ...queryOptionParams,
        ...options,
      };
    }

    return queryOptions(queryOptionParams);
  };
};
