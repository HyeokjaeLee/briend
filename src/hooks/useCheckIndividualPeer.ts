import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES } from '@/constants';
import { usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';

import { useCookies } from './useCookies';

interface CheckIndividualPeerOptions {
  interval: number;
}

export const useCheckIndividualPeer = (
  userId?: string | null,
  options?: CheckIndividualPeerOptions,
) => {
  const [
    isMounted,
    friendConnectionsData,
    setFriendConnections,
    requestedPingPongMap,
  ] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.friendConnections.data,
      state.setFriendConnections,
      state.requestedPingPongMap,
    ]),
  );

  const interval = options?.interval ?? 10_000;

  const [{ USER_ID: myUserId }] = useCookies([COOKIES.USER_ID]);

  useEffect(() => {
    if (!isMounted || !myUserId || !userId) return;

    const checkingInterval = setInterval(() => {
      requestedPingPongMap.forEach((userId, requestId) => {
        const friendPeer = friendConnectionsData.get(userId);

        //* 이전 요청에서 돌아오지 않은 응답이 있는 경우 disconnect
        if (friendPeer) {
          friendPeer.connection?.removeAllListeners();
          friendPeer.connection?.close();

          setFriendConnections((prevMap) =>
            prevMap.set(userId, {
              ...friendPeer,
              connection: null,
              isConnected: false,
            }),
          );
        }

        requestedPingPongMap.delete(requestId);
      });

      const friendPeer = friendConnectionsData.get(userId);

      if (friendPeer?.isConnected) {
        const id = nanoid();

        requestedPingPongMap.set(id, userId);

        return friendPeer.connection?.send({
          type: MESSAGE_TYPE.CHECK_PEER_STATUS,
          data: myUserId,
          id,
        } satisfies PeerData);
      }
    }, interval);

    return () => clearInterval(checkingInterval);
  }, [
    friendConnectionsData,
    interval,
    isMounted,
    myUserId,
    requestedPingPongMap,
    setFriendConnections,
    userId,
  ]);

  const friendPeer = userId ? friendConnectionsData.get(userId) : undefined;

  return {
    isLoading: !friendPeer,
    friendPeer,
  };
};
