import { shallow } from 'zustand/shallow';

import { useChattingDataStore } from '@/store/useChattingDataStore';

export const useChattingRoomHistoryList = () => {
  const [isMounted, chattingRoomList, lastMessageList] = useChattingDataStore(
    (state) => [state.isMounted, state.chattingRoomList, state.lastMessageList],
    shallow,
  );

  if (!isMounted) return [];

  return chattingRoomList
    .map(({ token, endAt, opponentName, opponentLanguage, startAt }) => {
      const lastMessage = lastMessageList.find(
        (lastMessage) => lastMessage.token === token,
      );

      return {
        token,
        endAt,
        opponentName,
        opponentLanguage,
        startAt,
        lastMessage: lastMessage?.message,
      };
    })
    .sort((a, b) => b.startAt.getTime() - a.startAt.getTime());
};

export type ChattingRoomHistory = ReturnType<
  typeof useChattingRoomHistoryList
>[number];
