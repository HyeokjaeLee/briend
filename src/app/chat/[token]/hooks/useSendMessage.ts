import axios from 'axios';

import { useState } from 'react';

import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Message } from '@/types';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const chattingRoom = useChattingRoomIndexDBStore(
    (state) => state.chattingRoom,
  );

  const setSendingMessageMap = useTempMessageStore(
    (state) => state.setSendingMessageMap,
  );

  const sendMessage = async (text: string) => {
    if (!chattingRoom) throw new Error('채팅방 정보가 없습니다.');
    setIsLoading(true);
    const message: Message = {
      meta: {
        from: chattingRoom.userName,
        to: chattingRoom.opponentName,
        createdAt: new Date(),
      },

      message: {
        [chattingRoom.userLanguage]: text,
      },
    };

    const { status } = await axios.post(
      `${chattingRoom.token}/api/send`,
      message,
    );

    switch (status) {
      case 200: {
        setSendingMessageMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(message.meta.createdAt, text);
          return newMap;
        });
      }
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    sendMessage,
  };
};
