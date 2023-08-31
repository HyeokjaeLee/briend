import * as socketIO from 'socket.io-client';

import { useEffect, useState } from 'react';

import { SOCKET } from '@/constants';

interface UseConnetSocketRoomParams {
  isRoomCreated: boolean;
  id: string | undefined;
}

export const useConnetSocketRoom = ({
  isRoomCreated,
  id,
}: UseConnetSocketRoomParams) => {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<socketIO.Socket>();

  useEffect(() => {
    if (isRoomCreated && id) {
      const room = socketIO.connect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${id}`,
        {
          path: `${SOCKET.PATH}`,
        },
      );

      room.on('connect', () => {
        setRoom(room);
        setIsConnected(true);
      });

      return () => {
        room.disconnect();
        setIsConnected(false);
      };
    }
  }, [id, isRoomCreated]);

  return { isConnected, room };
};

export type UseConnetSocketRoomResult = ReturnType<typeof useConnetSocketRoom>;
