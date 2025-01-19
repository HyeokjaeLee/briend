'use client';

import type { DataConnection, Peer } from 'peerjs';

import { create } from 'zustand';

export interface FriendPeer {
  peerId: string;
  connection: DataConnection | null;
  isConnected: boolean;
  isExpired: boolean;
  exp: number;
}

interface PeerStore {
  isMounted: boolean;
  mount: () => void;

  peer: Peer | null;
  setPeer: (peer: Peer | null) => void;

  /** map객체의 변경을 감지하기 위해 변경되는 객체 주소를 가져야함  */
  friendConnections: {
    data: Map<string, FriendPeer>;
  };
  setFriendConnections: (
    setStateAction?: (prevMap: Map<string, FriendPeer>) => void,
  ) => void;
}

export const usePeerStore = create<PeerStore>((set) => ({
  isMounted: false,
  mount: () => set({ isMounted: true }),

  peer: null,
  setPeer: (peer) => set({ peer }),

  friendConnections: {
    data: new Map<string, FriendPeer>(),
  },
  setFriendConnections: (setStateAction) =>
    set(({ friendConnections: { data } }) => {
      setStateAction?.(data);

      return {
        friendConnections: {
          data,
        },
      };
    }),
}));
