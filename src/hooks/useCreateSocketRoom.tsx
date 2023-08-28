import axios from 'axios';
import * as socketIO from 'socket.io-client';

import { useEffect, useState } from 'react';

import { SOCKET } from '@/constants';

export const useCreateSocketRoom = (id: string | undefined) => {
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  useEffect(() => {
    socketIO.connect(`localhost:3000`, {
      path: `${SOCKET.PATH}`,
    });

    if (id) {
      (async () => {
        const { status } = await axios.post('/api/create-room', {
          id,
        });

        if (status === 201) setIsRoomCreated(true);
      })();
    }
  }, [id]);

  return { isRoomCreated };
};
