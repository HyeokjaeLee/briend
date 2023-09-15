import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { CHANNEL_EVENT } from '@/constants';
import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import type { Message } from '@/types';

export const useReceiveChatting = () => {
  const [chattingRoom, messageList, createMessage] =
    useChattingRoomIndexDBStore(
      (state) => [state.chattingRoom, state.messageList, state.createMessage],
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

        createMessage(message);
      });
    }
  }, [chattingRoom, createMessage, setSendingMessageMap]);

  return { messageList };
};
