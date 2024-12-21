import type { EntityTable } from 'dexie';

import { useLiveQuery } from 'dexie-react-hooks';

import { CustomError, ERROR_STATUS } from '@/utils/customError';

export const useIndexedDB = <
  TTable extends EntityTable<any, any> | undefined,
  TReturn,
>(
  table: TTable,
  callback: (table: NonNullable<TTable>) => Promise<TReturn> | undefined,
  deps?: any[],
) =>
  useLiveQuery(() => {
    if (!table)
      throw new CustomError({
        status: ERROR_STATUS.NOT_FOUND,
        message: 'Table not found',
      });

    return callback(table);
  }, deps);
