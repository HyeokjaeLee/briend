import { SocketApiHander } from '@/types';

export interface Chatting {
  user: string;
  message: string;
}

const chat: SocketApiHander = (req, res) => {
  try {
    const { roomsMap } = res.socket.server;
    const { authorization } = req.headers;

    if (req.method === 'POST') {
      if (roomsMap && authorization) {
        const { room } = roomsMap.get(authorization) ?? {};

        if (room) {
          room.emit('message', req.body);
          res.status(201).send('ok');
        } else throw new Error("Can't find room");
      } else throw new Error("Can't find roomMap");
    } else throw new Error('Invalid method');
  } catch (e) {
    res.status(500).send(String(e));
  }
};

export default chat;
