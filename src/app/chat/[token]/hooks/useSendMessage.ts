import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useState } from 'react';

import { useExpiredTokenErrorToast } from '@/hooks/useExpiredTokenErrorToast';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Message } from '@/types';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  const [setSendingMessageMap, setMessageText] = useTempMessageStore(
    (state) => [state.setSendingMessageMap, state.setMessageText],
    shallow,
  );

  const { toast } = useToast();

  const { toastExpiredTokenError } = useExpiredTokenErrorToast();

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

    try {
      const { status } = await axios.post(
        `${chattingRoom.token}/api/send`,
        message,
      );

      if (status === 200) {
        setSendingMessageMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(new Date(message.meta.createdAt).getTime(), text);
          return newMap;
        });
        setMessageText('');
      }

      setIsLoading(false);
    } catch (e) {
      if (!toastExpiredTokenError(e)) {
        toast({
          type: 'fail',
          message: String(e),
        });
      }

      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage,
  };
};
