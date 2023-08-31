import axios from 'axios';
import * as socketIO from 'socket.io-client';

import { useCallback, useEffect, useState } from 'react';

import { SOCKET } from '@/constants';

export const useCreateSocketRoom = (id: string | undefined) => {
  const [isRoomCreated, setIsRoomCreated] = useState(false);

  const createRoom = useCallback(async (id: string) => {
    const { status } = await axios.post('/api/create-room', {
      id,
    });

    switch (status) {
      case 200:
      case 201:
        return setIsRoomCreated(true);
    }
  }, []);

  useEffect(() => {
    socketIO.connect(process.env.NEXT_PUBLIC_BASE_URL ?? '', {
      path: `${SOCKET.PATH}`,
    });

    if (id) {
      createRoom(id);
      const interval = setInterval(
        () => createRoom(id),
        SOCKET.TIME_TO_ROOM_LIVE - 1_000,
      );

      return () => clearInterval(interval);
    }
  }, [id, createRoom]);

  return { isRoomCreated };
};
