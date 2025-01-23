import { useEffect } from 'react';

import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useUserId } from '@/hooks';
import { usePeerStore } from '@/stores';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { isPeerData } from '@/utils';

export const PeerMessageReceiver = () => {
  const friendConnections = usePeerStore((state) => state.friendConnections);

  const myUserId = useUserId();

  useEffect(() => {
    if (!myUserId) return;

    const unmountHandlerList: (() => void)[] = [];

    friendConnections.data.forEach(({ connection }) => {
      if (!connection) return;

      const dataHandler = (peerMessage: unknown) => {
        //* ping pong 응답
        if (typeof peerMessage === 'string') {
          return friendConnections.data
            .get(peerMessage)
            ?.connection?.send(peerMessage);
        }

        if (!isPeerData(peerMessage)) return;

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
        }
      };

      connection.on('data', dataHandler);

      unmountHandlerList.push(() => connection.off('data', dataHandler));
    });

    return () => unmountHandlerList.forEach((handler) => handler());
  }, [friendConnections, myUserId]);

  return null;
};
