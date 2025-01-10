import { useShallow } from 'zustand/shallow';

import { useEffect, useRef } from 'react';

import { COOKIES } from '@/constants';
import { usePeerStore } from '@/stores';
import type { FriendPeer } from '@/stores/peer';

import { useCookies } from './useCookies';

interface CheckIndividualPeerOptions {
  interval: number;
}
export const useCheckIndividualPeer = (
  userId?: string | null,
  options?: CheckIndividualPeerOptions,
) => {
  const [friendConnections, setFriendConnections] = usePeerStore(
    useShallow((state) => [
      state.friendConnections,
      state.setFriendConnections,
    ]),
  );

  const [{ USER_ID: myUserId }] = useCookies([COOKIES.USER_ID]);

  let friendPeer: FriendPeer | undefined;

  if (userId) {
    friendPeer = friendConnections.data.get(userId);
  }

  const interval = options?.interval ?? 10_000;

  const isSendedRef = useRef(false);

  useEffect(() => {
    if (!myUserId || !userId) return;

    const { connection, isConnected } = friendPeer ?? {};

    if (!connection || !isConnected) return;

    const sendPing = () => {
      isSendedRef.current = true;

      connection.send(myUserId);
    };

    const pongHandler = (data: unknown) => {
      if (data === myUserId) {
        isSendedRef.current = false;
      }
    };

    const checkInterval = setInterval(() => {
      if (!friendPeer) return clearInterval(checkInterval);

      if (!isSendedRef.current) return sendPing();

      connection.removeAllListeners();

      connection.close();

      setFriendConnections((prevMap) =>
        prevMap.set(userId, {
          ...friendPeer,
          connection: null,
          isConnected: false,
        }),
      );
    }, interval);

    sendPing();

    connection.on('data', pongHandler);

    return () => {
      clearInterval(checkInterval);

      connection.off('data', pongHandler);
    };
  }, [friendPeer, myUserId, interval, setFriendConnections, userId]);

  return {
    friendPeer,
  };
};
