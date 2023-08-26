import http from 'http';

import { Server } from 'socket.io';

import { NextApiResponse } from 'next';

import { NextApiResponseServerIO } from '@/types';

const SocketHandler = (req, res: NextApiResponseServerIO) => {
  http.ServerResponse;
  if (res?.socket?.server?.io) console.log('이미 바인딩 되었습니다.');
  else {
    console.log('서버-소켓 연결완료');
    const io = new Server(res?.socket?.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    console.log(io);
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
