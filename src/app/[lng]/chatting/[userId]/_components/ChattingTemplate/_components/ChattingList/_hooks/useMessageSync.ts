import { messageTable } from '@/database/indexed-db';
import { useIndexedDB } from '@/hooks';

export const useMessageSync = (friendUserId: string) => {
  const messageList = useIndexedDB(
    messageTable,
    (table) => {
      if (!friendUserId) return;

      return table
        .where('fromUserId')
        .equals(friendUserId)
        .or('toUserId')
        .equals(friendUserId)
        .sortBy('timestamp');
    },
    [friendUserId],
  );

  return {
    messageList,
  };
};
