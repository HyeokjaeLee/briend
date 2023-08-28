import axios from 'axios';
import * as socketIO from 'socket.io-client';
import { shallow } from 'zustand/shallow';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { SOCKET } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useSocketStore } from '@/store/socketStore';

export const useConnectSocket = () => {
  const param = useSearchParams();
  const [setSocket, setIsConnected, isConnected] = useSocketStore(
    (state) => [state.setSocket, state.setIsConnected, state.isConnected],
    shallow,
  );

  const id = useAuthStore((state) => state.id);

  useEffect(() => {
    if (id) axios.post('/api/chat', { id });
  }, [id]);

  useEffect(() => {
    const socket = socketIO.connect('localhost:3000', {
      path: `${SOCKET.PATH}`,
    });

    setSocket(socket);

    socket.on('connect', () => setIsConnected(true));

    if (socket) {
      return () => {
        socket.disconnect();
        setIsConnected(false);
      };
    }
  }, [setSocket, setIsConnected, param]);

  return { isConnected };
};
