'use client';

import type { JWTPayload } from 'jose';

import { create } from 'zustand';

import { MAX_FIREND_COUNT } from '@/constants/etc';
import type { JwtPayload } from '@/types/jwt';

interface FriendStore {
  friendList: (JwtPayload.FriendToken & JWTPayload)[];
  setFriendList: (friendList: (JwtPayload.FriendToken & JWTPayload)[]) => void;
  isLinimtedAddFriend: boolean;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friendList: [],
  setFriendList: (friendList) => {
    const isLinimtedAddFriend = MAX_FIREND_COUNT <= friendList.length;
    set({ friendList, isLinimtedAddFriend });
  },
  isLinimtedAddFriend: false,
}));
