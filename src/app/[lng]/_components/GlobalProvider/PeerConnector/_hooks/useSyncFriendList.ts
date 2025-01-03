import type { Peer } from 'peerjs';

import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES, IS_DEV, PEER_PREFIX } from '@/constants';
import { useCookies } from '@/hooks';
import { useFriendStore, usePeerStore } from '@/stores';
import type { PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { checkExpired, CustomError, ERROR } from '@/utils';

export const useSyncFriendList = (peer: Peer | null) => {
  const [
    isPeerStoreMounted,
    mountPeerStore,

    friendConnectionsData,
    setFriendConnections,

    requestedPingPongMap,
  ] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.mount,

      state.friendConnections.data,
      state.setFriendConnections,

      state.requestedPingPongMap,
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

    const expireInterval = setInterval(
      () => {
        //* 이전 요청에서 돌아오지 않은 응답이 있는 경우 disconnect
        requestedPingPongMap.forEach((userId, requestId) => {
          const friendPeer = friendConnectionsData.get(userId);

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
            setFriendConnections();
          }

          requestedPingPongMap.delete(requestId);
        });

        friendConnectionsData.forEach((friendPeer, userId) => {
          if (friendPeer.isExpired) return;

          const isExpired = checkExpired(friendPeer.exp);

          if (!isExpired) {
            if (friendPeer.isConnected) {
              const id = nanoid();

              requestedPingPongMap.set(id, userId);

              return friendPeer.connection?.send({
                type: MESSAGE_TYPE.CHECK_PEER_STATUS,
                data: myUserId,
                id,
              } satisfies PeerData);
            }

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
      },
      IS_DEV ? 3_000 : 10_000,
    );

    return () => clearInterval(expireInterval);
  }, [
    myUserId,
    friendConnectionsData,
    isPeerStoreMounted,
    peer,
    setFriendConnections,
    requestedPingPongMap,
  ]);
};
