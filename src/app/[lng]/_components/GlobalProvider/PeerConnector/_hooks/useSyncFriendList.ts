import type { Peer } from 'peerjs';

import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES, PEER_PREFIX } from '@/constants';
import { useCookies } from '@/hooks';
import { useFriendStore, usePeerStore } from '@/stores';
import { checkExpired, CustomError, ERROR } from '@/utils';

export const useSyncFriendList = (peer: Peer | null) => {
  const [
    isPeerStoreMounted,
    mountPeerStore,

    friendConnectionsData,
    setFriendConnections,
  ] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.mount,

      state.friendConnections.data,
      state.setFriendConnections,
    ]),
  );

  const [friendList, isFriendStoreMounted] = useFriendStore(
    useShallow((state) => [state.friendList, state.isMounted]),
  );

  useEffect(() => {
    if (!isFriendStoreMounted || !peer) return;

    setFriendConnections((prevMap) => {
      //* 친구목록에 업데이트된 친구 connection 객체 생성
      friendList.forEach(({ userId, exp }) => {
        const friendConnection = prevMap.get(userId);

        if (!exp) throw new CustomError(ERROR.UNKNOWN_VALUE('exp'));

        const isExpired = checkExpired(exp);

        if (friendConnection) return;

        prevMap.set(userId, {
          isExpired,
          connection: isExpired ? null : peer.connect(PEER_PREFIX + userId),
          isConnected: false,
          connectionType: 'outgoing',
          peerId: PEER_PREFIX + userId,
          exp,
        });
      });

      //* 삭제된 친구 연결 제거
      prevMap.forEach(({ connection }, userId) => {
        const isExistedFriend = friendList.find(
          (friend) => friend.userId === userId,
        );

        if (isExistedFriend) return;

        connection?.removeAllListeners();
        connection?.close();

        prevMap.delete(userId);
      });
    });

    mountPeerStore();
  }, [
    friendList,
    isFriendStoreMounted,
    peer,
    setFriendConnections,
    mountPeerStore,
  ]);

  const [{ USER_ID: myUserId }] = useCookies([COOKIES.USER_ID]);

  useEffect(() => {
    if (!isPeerStoreMounted || !peer || !myUserId) return;

    const expireInterval = setInterval(() => {
      friendConnectionsData.forEach((friendPeer, userId) => {
        if (friendPeer.isExpired) return;

        const isExpired = checkExpired(friendPeer.exp);

        if (!isExpired) {
          if (friendPeer.isConnected) return;

          return setFriendConnections((prevMap) =>
            prevMap.set(userId, {
              ...friendPeer,
              connectionType: 'outgoing',
              connection: peer.connect(friendPeer.peerId),
            }),
          );
        }

        if (!friendPeer.isExpired || friendPeer.connection) {
          friendPeer.connection?.removeAllListeners();
          friendPeer.connection?.close();

          setFriendConnections((prevMap) =>
            prevMap.set(userId, {
              ...friendPeer,
              isExpired: true,
              connection: null,
            }),
          );
        }
      });
    }, 10_000);

    return () => clearInterval(expireInterval);
  }, [
    myUserId,
    friendConnectionsData,
    isPeerStoreMounted,
    peer,
    setFriendConnections,
  ]);
};
