import type { DataConnection } from 'peerjs';

import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { PEER_PREFIX } from '@/constants';
import { usePeerStore } from '@/stores';
import { checkExpired } from '@/utils';

import { usePeer } from './_hooks/usePeer';
import { useSyncFriendList } from './_hooks/useSyncFriendList';

export const PeerConnector = () => {
  const peer = usePeer();

  useSyncFriendList(peer);

  const [isPeerStoreMounted, friendConnections, setFriendConnections] =
    usePeerStore(
      useShallow((state) => [
        state.isMounted,
        state.friendConnections,
        state.setFriendConnections,
      ]),
    );

  useEffect(() => {
    if (!peer || !isPeerStoreMounted) return;

    const incomingConnectionHandler = (connection: DataConnection) => {
      const userId = connection.peer.replace(PEER_PREFIX, '');

      setFriendConnections((prevMap) => {
        const firendConnection = prevMap.get(userId);

        if (!firendConnection) return;

        const isExpired = checkExpired(firendConnection.exp);

        prevMap.set(userId, {
          ...firendConnection,
          connection: isExpired ? null : connection,
          connectionType: 'incoming',
          isConnected: !isExpired,
          isExpired,
        });
      });
    };

    peer.on('connection', incomingConnectionHandler);

    return () => {
      peer.off('connection', incomingConnectionHandler);
    };
  }, [peer, isPeerStoreMounted, setFriendConnections]);

  useEffect(() => {
    if (!isPeerStoreMounted) return;

    const { data } = friendConnections;

    const unmountHandlerList: (() => void)[] = [];

    data.forEach((friendPeer, userId) => {
      if (
        !friendPeer.connection ||
        friendPeer.isConnected ||
        friendPeer.connectionType === 'incoming'
      )
        return;

      const connectHandler = () =>
        setFriendConnections((prevMap) => {
          prevMap.set(userId, {
            ...friendPeer,
            isConnected: true,
          });
        });

      friendPeer.connection.on('open', connectHandler);

      unmountHandlerList.push(() =>
        friendPeer.connection?.off('open', connectHandler),
      );
    });

    return () => {
      unmountHandlerList.forEach((handler) => handler());
    };
  }, [friendConnections, isPeerStoreMounted, peer, setFriendConnections]);

  useEffect(() => {
    const { data } = friendConnections;

    const unmountHandlerList: (() => void)[] = [];

    //TODO: 추가적으로 채팅방에서 실시간으로 온라인 상태를 보여주는 핑퐁 메커니즘 구현해야함
    data.forEach((friendPeer, userId) => {
      if (!friendPeer.connection || !friendPeer.isConnected) return;

      const disconnectHandler = () =>
        setFriendConnections((prevMap) => {
          prevMap.set(userId, {
            ...friendPeer,
            isConnected: false,
          });
        });

      friendPeer.connection.on('close', disconnectHandler);
      friendPeer.connection.on('error', disconnectHandler);

      unmountHandlerList.push(() => {
        friendPeer.connection?.off('close', disconnectHandler);
        friendPeer.connection?.off('error', disconnectHandler);
      });

      return () => {
        unmountHandlerList.forEach((handler) => handler());
      };
    });
  }, [friendConnections, setFriendConnections]);

  return null;
};
