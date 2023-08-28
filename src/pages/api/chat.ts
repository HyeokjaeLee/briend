import { SocketApiHander } from '@/types';

const chat: SocketApiHander = (req, res) => {
  if (req.method === 'POST') {
    // 메시지 얻기

    const message = req.body;

    // on('message')가 메시지를 받음
    res.socket.server.io?.emit('message', message);

    res.status(201).json(message);
  }
};

export default chat;
