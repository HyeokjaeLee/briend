import { useEffect, useState } from 'react';

import { LOCAL_STORAGE_KEY } from '@/constants';
import type { Chatting } from '@socket-api/chat';

import type { UseConnetSocketRoomResult } from './useConnetSocketRoom';

interface ChattingInfo extends Chatting {
  isMine: boolean;
}

interface UseChattingListParams
  extends Pick<UseConnetSocketRoomResult, 'room'> {
  user: string | undefined;
  id: string | undefined;
}

export const useChattingList = ({ room, user, id }: UseChattingListParams) => {
  const [chattingList, setChattingList] = useState<ChattingInfo[]>([]);

  useEffect(() => {
    const savedChatting = localStorage.getItem(LOCAL_STORAGE_KEY.CHATTING_LIST);

    if (room) {
      if (savedChatting) setChattingList(JSON.parse(savedChatting));

      room.on('message', (chatting: Chatting) =>
        setChattingList((prev) => {
          const newChattingList = [
            ...prev,
            {
              ...chatting,
              isMine: chatting.user === user,
            },
          ];

          localStorage.setItem(
            LOCAL_STORAGE_KEY.CHATTING_LIST,
            JSON.stringify(newChattingList),
          );

          return newChattingList;
        }),
      );
    }
  }, [id, room, user]);

  return { chattingList };
};
