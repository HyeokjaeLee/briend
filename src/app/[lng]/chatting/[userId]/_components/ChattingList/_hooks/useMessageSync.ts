import { chattingDB } from '@/database/indexed';
import { useIndexedDB } from '@/hooks';

export const useMessageSync = (userId: string) => {
  const messageList = useIndexedDB(
    chattingDB.messages,
    (table) => {
      return table.where('userId').equals(userId).sortBy('timestamp');
    },
    [userId],
  );

  return {
    messageList,
  };
};
