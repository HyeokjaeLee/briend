import type { NextApiRequest, NextApiResponse } from 'next';

import type { Server as NetServer, Socket } from 'net';
import type { Server as IOServer, Namespace } from 'socket.io';

interface SocketApiRequest extends Omit<NextApiRequest, 'method'> {
  method: 'GET' | 'POST';
}

interface SocketApiResponse extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io?: IOServer;
      roomsMap?: Map<
        string,
        {
          room: Namespace;
          timer: NodeJS.Timeout;
        }
      >;
    };
  };
}

export type SocketApiHander = (
  req: SocketApiRequest,
  res: SocketApiResponse,
) => unknown | Promise<unknown>;
