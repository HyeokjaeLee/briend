import { SOCKET } from '@/constants';
import { SocketApiHander } from '@/types';

interface CreateRoomBody {
  id: string;
}

const createRoom: SocketApiHander = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { roomsMap } = res.socket.server;

      if (roomsMap) {
        const { id }: CreateRoomBody = req.body;
        const { io } = res.socket.server;

        if (io) {
          if (!roomsMap.has(id)) {
            roomsMap.set(id, {
              room: io.of(`/${id}`),
              timer: setTimeout(
                () => roomsMap.delete(id),
                SOCKET.TIME_TO_ROOM_LIVE,
              ),
            });
          }

          res.status(201).send('ok');
        } else throw new Error('io is not defined');
      } else throw new Error('roomsMap is not defined');
    } else throw new Error('Method not allowed');
  } catch (e) {
    res.status(500).json({ message: String(e) });
  }
};

export default createRoom;
