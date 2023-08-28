import { SocketApiHander } from '@/types';

export const createRoom: SocketApiHander = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { roomsMap } = res.socket.server;
    }
  } catch (e) {}
};
