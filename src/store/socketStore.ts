import { createWithEqualityFn } from 'zustand/traditional';

import type { Socket } from 'socket.io-client';

interface SocketStore {
  socket?: Socket;
  setSocket: (socket: Socket) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

export const useSocketStore = createWithEqualityFn<SocketStore>(
  (set) => ({
    setSocket: (socket) => set({ socket }),
    isConnected: false,
    setIsConnected: (isConnected) => set({ isConnected }),
  }),
  Object.is,
);
