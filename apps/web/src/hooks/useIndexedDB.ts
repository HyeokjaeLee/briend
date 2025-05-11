import type { EntityTable } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

import { CustomError } from '@/utils';

export const useIndexedDB = <
  TTable extends EntityTable<any, any> | undefined,
  TReturn,
>(
  table: TTable,
  callback: (table: NonNullable<TTable>) => Promise<TReturn> | undefined,
  deps?: any[],
) =>
  useLiveQuery(() => {
    if (!table) throw new CustomError('Table not found');

    return callback(table);
  }, deps);
