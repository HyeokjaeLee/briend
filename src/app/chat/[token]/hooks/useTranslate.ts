import axios from 'axios';

import { useEffect } from 'react';

import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';
import type { Message } from '@/types';
import { naming } from '@/utils/naming';

export const useTranslate = () => {
  const chattingRoom = useChattingRoomIndexDBStore(
    (state) => state.chattingRoom,
  );

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
