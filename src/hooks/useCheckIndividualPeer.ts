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

//TODO: 스테이트 하나에 원시 타입으로 하나만 담아서 앱 전체에서 하나만 볼 수 있게 해야함
export const useCheckIndividualPeer = (
  userId?: string | null,
  options?: CheckIndividualPeerOptions,
) => {
  const [
    isMounted,
    friendConnections,
    setFriendConnections,
    requestedPingPongMap,
  ] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.friendConnections,
      state.setFriendConnections,
      state.requestedPingPongMap,
    ]),
  );

  const interval = options?.interval ?? 10_000;

  const [{ USER_ID: myUserId }] = useCookies([COOKIES.USER_ID]);

  useEffect(() => {
    if (!isMounted || !myUserId || !userId) return;

    const friendConnectionsData = friendConnections.data;

    const checkPeer = () => {
      requestedPingPongMap.forEach(({ userId, requestAt }, requestId) => {
        //! hook 특성상 연속 실행되는 경우가 있음, 그런경우 연결이 끊어지지 않아야함
        const isFresh = new Date().getTime() - requestAt.getTime() < interval;

        if (isFresh) return;

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

        requestedPingPongMap.set(id, {
          userId,
          requestAt: new Date(),
        });

        return friendPeer.connection?.send({
          type: MESSAGE_TYPE.CHECK_PEER_STATUS,
          data: myUserId,
          id,
        } satisfies PeerData);
      }
    };

    checkPeer();

    const checkPeerInterval = setInterval(checkPeer, interval);

    return () => clearInterval(checkPeerInterval);
  }, [
    friendConnections.data,
    interval,
    isMounted,
    myUserId,
    requestedPingPongMap,
    setFriendConnections,
    userId,
  ]);

  const friendPeer = userId ? friendConnections.data.get(userId) : undefined;

  return {
    isLoading: !friendPeer,
    friendPeer,
  };
};
