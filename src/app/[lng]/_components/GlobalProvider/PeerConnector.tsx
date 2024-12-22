'use client';

import { type DataConnection, Peer } from 'peerjs';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES, PEER_PREFIX } from '@/constants';
import { useCookies } from '@/hooks';
import { useFriendStore, usePeerStore } from '@/stores';

export const PeerConnector = () => {
  const [cookies] = useCookies([COOKIES.USER_ID]);
  const [peer, setPeer, setFriendConnectionMap] = usePeerStore(
    useShallow((state) => [
      state.peer,
      state.setPeer,
      state.setFriendConnectionMap,
    ]),
  );

  const friendList = useFriendStore((state) => state.friendList);

  const userId = cookies.USER_ID;

  useEffect(() => {
    if (!userId) return;

    const peer = new Peer(PEER_PREFIX + userId);

    peer.on('open', () => {
      setPeer(peer);
    });

    return () => {
      const { friendConnectionMap } = usePeerStore.getState();

      friendConnectionMap.forEach(({ connection }) => {
        connection?.close();
      });

      setPeer(null);

      peer.destroy();
    };
  }, [setPeer, userId]);

  useEffect(() => {
    if (!friendList.length || !peer) return;

    setFriendConnectionMap((prevMap) => {
      friendList.forEach(({ userId, exp }) => {
        const isExpired = exp ? exp * 1000 < Date.now() : true;

        if (prevMap.has(userId)) return;

        const peerId = PEER_PREFIX + userId;

        const connection = isExpired ? null : peer.connect(peerId);

        if (connection) {
          const disconectHandler = () =>
            setFriendConnectionMap((prevMap) => {
              const firendConnection = prevMap.get(userId);

              if (firendConnection) {
                firendConnection.isConnected = false;

                prevMap.set(userId, firendConnection);
              }
            });

          connection.on('close', disconectHandler);

          connection.on('error', disconectHandler);
        }

        prevMap.set(userId, {
          isExpired,
          peerId,
          isConnected: false,
          connection,
        });
      });
    });
  }, [friendList, peer, setFriendConnectionMap]);

  useEffect(() => {
    if (!peer) return;

    const connectHandler = (connection: DataConnection) => {
      setFriendConnectionMap((prevMap) => {
        const friendUserId = connection.peer.replace(PEER_PREFIX, '');

        const firendConnection = prevMap.get(friendUserId);

        if (firendConnection) {
          firendConnection.isConnected = true;

          prevMap.set(friendUserId, firendConnection);
        }
      });
    };

    peer.on('connection', connectHandler);

    return () => {
      peer.off('connection', connectHandler);
    };
  }, [peer, setFriendConnectionMap]);

  return null;
};
