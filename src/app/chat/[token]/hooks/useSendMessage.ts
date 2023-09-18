import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useState } from 'react';

import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Message } from '@/types';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const chattingRoom = useChattingRoomStore((state) => state.chattingRoom);

  const [setSendingMessageMap, setMessageText] = useTempMessageStore(
    (state) => [state.setSendingMessageMap, state.setMessageText],
    shallow,
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
        setMessageText('');
      }
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    sendMessage,
  };
};
