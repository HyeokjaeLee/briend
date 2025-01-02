import { useEffect } from 'react';

import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { CustomError, ERROR, hasObjectKey, isEnumValue } from '@/utils';

export const PeerMessageReceiver = () => {
  const friendConnections = usePeerStore((state) => state.friendConnections);

  useEffect(() => {
    friendConnections.data.forEach(({ connection }) => {
      if (!connection) return;

      connection.on('data', (unkownData) => {
        if (
          !hasObjectKey(unkownData, 'type') ||
          !isEnumValue(MESSAGE_TYPE, unkownData.type)
        )
          throw new CustomError(ERROR.UNKNOWN_VALUE());

        const { data, type } = unkownData as PeerData;

        //TODO: 여기서 모든 P2P 메시지들을 처리해서 각 데이터베이스에 저장해줘야함
        switch (type) {
          case MESSAGE_TYPE.MESSAGE:
            messageTable?.put({
              ...data,
              state: MESSAGE_STATE.RECEIVE,
            });
            break;

          case MESSAGE_TYPE.CHECK_RECEIVE_MESSAGE:
            messageTable?.update(data.id, {
              state: MESSAGE_STATE.RECEIVE,
            });
        }
      });
    });
  }, [friendConnections]);

  return null;
};
