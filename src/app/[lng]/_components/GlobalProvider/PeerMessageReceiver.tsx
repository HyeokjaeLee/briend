import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES } from '@/constants';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useCookies } from '@/hooks';
import { usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { toast } from '@/utils/client';

export const PeerMessageReceiver = () => {
  const [friendConnections, requestedPingPongMap] = usePeerStore(
    useShallow((state) => [
      state.friendConnections,
      state.requestedPingPongMap,
    ]),
  );

  const [{ USER_ID: userId }] = useCookies([COOKIES.USER_ID]);

  useEffect(() => {
    if (!userId) return;

    friendConnections.data.forEach(({ connection }) => {
      if (!connection) return;
      connection.on('data', (data) => {
        const peerMessage = data as PeerData;

        switch (peerMessage.type) {
          case MESSAGE_TYPE.MESSAGE:
            return messageTable?.put({
              id: peerMessage.id,
              ...peerMessage.data,
              state: MESSAGE_STATE.RECEIVE,
            });

          case MESSAGE_TYPE.CHECK_RECEIVE_MESSAGE:
            return messageTable?.update(peerMessage.id, {
              state: MESSAGE_STATE.RECEIVE,
            });

          case MESSAGE_TYPE.CHECK_PEER_STATUS:
            if (peerMessage.data === userId)
              //* 보냈던 요청이 돌아오면 다음 disconnect 이벤트에서 제외
              toast({
                message: 'connected',
              });
            requestedPingPongMap.delete(peerMessage.id);

            return connection.send(peerMessage satisfies PeerData);
        }
      });
    });
  }, [friendConnections, userId, requestedPingPongMap]);

  return null;
};
