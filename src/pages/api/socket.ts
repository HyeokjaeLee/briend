import { Server as ServerIO, ServerOptions } from 'socket.io';

import { SOCKET } from '@/constants';
import { SocketApiHander } from '@/types';

import type { Server } from 'http';

const socket: SocketApiHander = (_, res) => {
  const { server } = res.socket;

  if (!server.io) {
    server.io = new ServerIO(
      server as Server,
      {
        path: SOCKET.PATH,
        addTrailingSlash: false,
      } as unknown as ServerOptions,
    );

    server.roomsMap = new Map();
  }

  res.send('ok');
};

export default socket;
