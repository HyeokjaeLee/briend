import { Peer } from 'peerjs';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { PEER_PREFIX } from '@/constants';
import { useUserId } from '@/hooks';
import { usePeerStore } from '@/stores';

export const usePeer = () => {
  const userId = useUserId();
  const [peer, setPeer] = usePeerStore(
    useShallow((state) => [state.peer, state.setPeer]),
  );

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

    const peerOpenHandler = () => {
      setPeer(peer);
    };

    peer.on('open', peerOpenHandler);

    return () => {
      peer.destroy();
      peer.off('open', peerOpenHandler);
      setPeer(null);
    };
  }, [setPeer, userId]);

  return peer;
};
