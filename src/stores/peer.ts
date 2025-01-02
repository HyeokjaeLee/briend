'use client';

import type { DataConnection, Peer } from 'peerjs';

import { create } from 'zustand';

import { CustomError } from '@/utils';

export interface FriendPeer {
  peerId: string;
  connection: DataConnection | null;
  isConnected: boolean;
  isExpired: boolean;
}

interface PeerStore {
  isMounted: boolean;
  mount: () => void;

  peer: Peer | null;
  setPeer: (peer: Peer | null) => void;

  friendConnectionMap: Map<string, FriendPeer>;
  setFriendConnectionMap: (
    setStateAction: (prevMap: Map<string, FriendPeer>) => void,
  ) => void;
  updateFriendConnectStatus: (userId: string, isConnected: boolean) => void;
}

export const usePeerStore = create<PeerStore>((set) => {
  //* 동시성 이슈를 해결하기 위해 해당 Map객체만을 참조, 수정하여 상태값으로 사용

  const baseConnectedPeerMap = new Map<string, FriendPeer>();

  return {
    isMounted: false,
    mount: () => set({ isMounted: true }),

    peer: null,
    setPeer: (peer) => set({ peer }),

    friendConnectionMap: baseConnectedPeerMap,
    setFriendConnectionMap: (setStateAction) => {
      setStateAction(baseConnectedPeerMap);

      set({
        friendConnectionMap: new Map(baseConnectedPeerMap),
      });
    },
    updateFriendConnectStatus: (userId, isConnected) => {
      const friendConnection = baseConnectedPeerMap.get(userId);

      if (!friendConnection)
        throw new CustomError({
          message: 'Friend Connection Not Found',
        });

      friendConnection.isConnected = isConnected;

      baseConnectedPeerMap.set(userId, friendConnection);

      set({
        friendConnectionMap: new Map(baseConnectedPeerMap),
      });
    },
  };
});
