import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { CHANNEL_EVENT } from '@/constants';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import type { Message } from '@/types';

export const useReceiveChatting = () => {
  const [chattingRoom, messageList, addMessage] = useChattingRoomStore(
    (state) => [state.chattingRoom, state.messageList, state.addMessage],
    shallow,
  );

  const setSendingMessageMap = useTempMessageStore(
    (state) => state.setSendingMessageMap,
  );

  useEffect(() => {
    if (chattingRoom) {
      const { channel } = chattingRoom;

      channel.bind(CHANNEL_EVENT.TRANSLATE, (message: Message) => {
        setSendingMessageMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(message.meta.createdAt);
          return newMap;
        });

        addMessage(message);
      });
    }
  }, [chattingRoom, addMessage, setSendingMessageMap]);

  return { messageList };
};
