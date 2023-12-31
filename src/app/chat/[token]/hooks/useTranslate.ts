import axios from 'axios';

import { useEffect } from 'react';

import { useChattingDataStore } from '@/store/useChattingDataStore';
import type { Message } from '@/types';
import { naming } from '@/utils/naming';

export const useTranslate = () => {
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  useEffect(() => {
    if (chattingRoom) {
      const { channel, userName, opponentName } = chattingRoom;
      const receivingEvent = naming.sendingEvent(opponentName, userName);
      channel.bind(receivingEvent, async (message: Message) =>
        axios.post(`${chattingRoom.token}/api/translate`, message),
      );

      return () => {
        channel.unbind(receivingEvent);
      };
    }
  }, [chattingRoom]);
};
