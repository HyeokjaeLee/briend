'use client';

import type Peer from 'peerjs';

import { create } from 'zustand';

import { useState } from 'react';

export enum CONNECTION_STATUS {
  CONNECTED = 0,
  DISCONNECTED = 2,
  ERROR = 1,
}

interface FriendPeer {
  peerId: string;
  isOnline: boolean;
}

interface PeerStore {
  connectionStatus: CONNECTION_STATUS;
  setConnectionStatus: (status: CONNECTION_STATUS) => void;

  peer: Peer | null;
  setPeer: (peer: Peer | null) => void;

  connectedFriendPeerMap: Map<string, FriendPeer>;
  setConnectedFriendPeerMap: (
    setStateAction: (prevMap: Map<string, FriendPeer>) => void,
  ) => void;
}

export const usePeerStore = create<PeerStore>((set) => {
  //* 동시성 이슈를 해결하기 위해 해당 Map객체만을 참조, 수정하여 상태값으로 사용
  const baseConnectedPeerMap = new Map<string, FriendPeer>();

  return {
    connectionStatus: CONNECTION_STATUS.DISCONNECTED,
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    peer: null,
    setPeer: (peer) => set({ peer }),

    connectedFriendPeerMap: baseConnectedPeerMap,
    setConnectedFriendPeerMap: (setStateAction) => {
      setStateAction(baseConnectedPeerMap);

      set({
        connectedFriendPeerMap: new Map(baseConnectedPeerMap),
      });
    },
  };
});
