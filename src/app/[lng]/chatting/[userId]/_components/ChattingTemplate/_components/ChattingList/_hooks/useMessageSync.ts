import { useRef, useState } from 'react';

import type { MessageTableItem } from '@/database/indexed-db';
import { messageTable } from '@/database/indexed-db';
import { useIndexedDB, useUserId } from '@/hooks';

const PAGE_SIZE = 10;

export const useMessageSync = (friendUserId: string) => {
  const myUserId = useUserId();
  const [page, setPage] = useState(1);
  const messageListRef = useRef<MessageTableItem[]>([]);

  const messageList = useIndexedDB(messageTable, (table) => {
    if (!friendUserId) return;

    return table
      .where('fromUserId')
      .equals(friendUserId)
      .or('toUserId')
      .equals(friendUserId)
      .sortBy('timestamp');
  });

  return {
    messageList,
  };
};
