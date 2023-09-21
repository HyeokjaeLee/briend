import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useSendingMessage = () => {
  const [sendingMessageMap, setIsOpponentLooking, setSendingMessageMap] =
    useTempMessageStore(
      (state) => [
        state.sendingMessageMap,
        state.setIsOpponentLooking,
        state.setSendingMessageMap,
      ],
      shallow,
    );

  const isSendingMessage = !!sendingMessageMap.size;

  const { toast } = useToast();

  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  useEffect(() => {
    if (isSendingMessage && chattingRoom) {
      const sendLockTimer = setTimeout(() => {
        setIsOpponentLooking(false);
        toast({
          message:
            LANGUAGE_PACK.FRIEND_NOT_LOOKING_CHATTING_TOAST[
              chattingRoom.userLanguage
            ],
          type: 'fail',
          holdTime: 10_000,
        });
        setSendingMessageMap(new Map());
      }, 5_000);
      return () => clearTimeout(sendLockTimer);
    }
  }, [
    isSendingMessage,
    setIsOpponentLooking,
    toast,
    setSendingMessageMap,
    chattingRoom,
  ]);

  return { isSendingMessage, sendingMessageList: [...sendingMessageMap] };
};
