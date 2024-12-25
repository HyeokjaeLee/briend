import { useEffect } from 'react';

import { usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { CustomError, ERROR, hasObjectKey, isEnumValue } from '@/utils';

export const PeerMessageReceiver = () => {
  const friendConnectionMap = usePeerStore(
    (state) => state.friendConnectionMap,
  );

  useEffect(() => {
    friendConnectionMap.forEach(({ connection }) => {
      if (!connection) return;

      connection.on('data', (unkownData) => {
        if (
          !hasObjectKey(unkownData, 'type') ||
          !isEnumValue(MESSAGE_TYPE, unkownData.type)
        )
          throw new CustomError(ERROR.UNKNOWN_VALUE());

        const data = unkownData as PeerData;

        //TODO: 여기서 모든 P2P 메시지들을 처리해서 각 데이터베이스에 저장해줘야함
        switch (data.type) {
          case MESSAGE_TYPE.MESSAGE:
            break;
        }
      });
    });
  }, [friendConnectionMap]);

  return null;
};
