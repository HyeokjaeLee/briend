import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useState } from 'react';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { ApiError, Message } from '@/types';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  const [setSendingMessageMap, setMessageText] = useTempMessageStore(
    (state) => [state.setSendingMessageMap, state.setMessageText],
    shallow,
  );

  const { toast } = useToast();

  const isHost = chattingRoom?.isHost;

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
          newMap.set(message.meta.createdAt, text);
          return newMap;
        });
        setMessageText('');
      }

      setIsLoading(false);
    } catch (e) {
      const { status } = (e as ApiError).response;

      switch (status) {
        case 401: {
          toast({
            type: 'warning',
            message: isHost
              ? '이 채팅방은 만료되었어요!\n 새로운 채팅방을 만들어주세요!'
              : LANGUAGE_PACK.JOIN_EXPIRED_CHATTING_ROOM_TOAST[
                  chattingRoom.userLanguage
                ](chattingRoom.opponentName),
          });
          break;
        }
        default:
          toast({
            type: 'fail',
            message: String(e),
          });
          break;
      }

      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage,
  };
};
