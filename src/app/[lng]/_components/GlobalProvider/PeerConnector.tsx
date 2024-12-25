'use client';

import { type DataConnection, Peer } from 'peerjs';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES, PEER_PREFIX } from '@/constants';
import { useCookies } from '@/hooks';
import { useFriendStore, usePeerStore } from '@/stores';

export const PeerConnector = () => {
  const [cookies] = useCookies([COOKIES.USER_ID]);
  const [
    peer,
    setPeer,
    setFriendConnectionMap,
    updateFriendConnectStatus,
    mount,
  ] = usePeerStore(
    useShallow((state) => [
      state.peer,
      state.setPeer,
      state.setFriendConnectionMap,
      state.updateFriendConnectStatus,
      state.mount,
    ]),
  );

  const friendList = useFriendStore((state) => state.friendList);

  const userId = cookies.USER_ID;

  useEffect(() => {
    if (!userId) return;

    const peer = new Peer(PEER_PREFIX + userId, {
      config: {
        reconnect: true,
        secure: true,
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
        pingInterval: 2_000,
        timeout: 5_000,
        retries: 3,
      },
    });

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
    // 상대방으로 부터 들어오는 연결 처리
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

  useEffect(() => {
    if (!friendList.length || !peer) return;

    const unmountHandlerList: (() => void)[] = [];

    setFriendConnectionMap((prevMap) =>
      friendList.forEach(({ userId, exp }) => {
        const isExpired = exp ? exp * 1000 < Date.now() : true;

        let friendConnection = prevMap.get(userId);

        if (friendConnection) {
          if (!friendConnection.isExpired && isExpired) {
            friendConnection.isExpired = true;
            friendConnection.connection = null;
          }
        } else {
          const peerId = PEER_PREFIX + userId;

          friendConnection = {
            isExpired,
            peerId,
            isConnected: false,
            connection: isExpired ? null : peer.connect(peerId),
          };
        }

        prevMap.set(userId, friendConnection);

        if (!friendConnection.connection) return;

        const connecHandler = () => updateFriendConnectStatus(userId, true);
        const disconectHandler = () => updateFriendConnectStatus(userId, false);

        friendConnection.connection.on('open', connecHandler);
        friendConnection.connection.on('close', disconectHandler);
        friendConnection.connection.on('error', disconectHandler);

        unmountHandlerList.push(() => {
          friendConnection.connection?.off('open', connecHandler);
          friendConnection.connection?.off('close', disconectHandler);
          friendConnection.connection?.off('error', disconectHandler);
        });
      }),
    );

    mount();

    return () => {
      unmountHandlerList.forEach((handler) => handler());
    };
  }, [
    friendList,
    peer,
    setFriendConnectionMap,
    mount,
    updateFriendConnectStatus,
  ]);

  return null;
};
