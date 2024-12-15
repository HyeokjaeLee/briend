'use client';

import type { JWTPayload } from 'jose';

import { create } from 'zustand';

import type { JwtPayload } from '@/types/jwt';

interface FriendStore {
  friendList: (JwtPayload.FriendToken & JWTPayload)[];
  setFriendList: (friendList: (JwtPayload.FriendToken & JWTPayload)[]) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friendList: [],
  setFriendList: (friendList) => set({ friendList }),
}));
