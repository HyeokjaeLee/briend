import http from 'http';

import { NextApiRequest } from 'next';

import { NextApiResponseServerIO } from '@/types';

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    // 메시지 얻기
    console.log('페이지', res.socket.server);
    const message = req.body;

    // on('message')가 메시지를 받음
    res?.socket?.server?.io?.emit('message', message);

    res.status(201).json(message);
  }
};

export default handler;
