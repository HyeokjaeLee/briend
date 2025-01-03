import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES } from '@/constants';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useCookies } from '@/hooks';
import { usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';

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

    const unmountHandlerList: (() => void)[] = [];

    friendConnections.data.forEach(({ connection }) => {
      if (!connection) return;

      const dataHandler = ((peerMessage: PeerData) => {
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

          case MESSAGE_TYPE.CHECK_PEER_STATUS: {
            if (peerMessage.data === userId)
              //* 보냈던 요청이 돌아오면 다음 disconnect 이벤트에서 제외
              return requestedPingPongMap.delete(peerMessage.id);

            return connection.send(peerMessage satisfies PeerData);
          }
        }
      }) as (data: unknown) => void;

      connection.on('data', dataHandler);

      unmountHandlerList.push(() => connection.off('data', dataHandler));
    });

    return () => unmountHandlerList.forEach((handler) => handler());
  }, [friendConnections, userId, requestedPingPongMap]);

  return null;
};
