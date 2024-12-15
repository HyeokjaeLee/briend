'use client';

import { Peer } from 'peerjs';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { COOKIES } from '@/constants/cookies';
import { PEER_PREFIX } from '@/constants/etc';
import { useCookies } from '@/hooks/useCookies';
import { useFriendStore } from '@/stores/friend';
import { usePeerStore } from '@/stores/peer';

export const PeerConnector = () => {
  const [cookies] = useCookies([COOKIES.USER_ID]);
  const [peer, setPeer] = usePeerStore(
    useShallow((state) => [state.peer, state.setPeer]),
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
      setPeer(null);
      peer.destroy();
    };
  }, [setPeer, userId]);

  return null;
};
