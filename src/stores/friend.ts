'use client';

import type { JWTPayload } from 'jose';
import { create } from 'zustand';

import { MAX_FRIEND_COUNT } from '@/constants/etc';
import type * as JwtPayload from '@/types/jwt';

interface FriendStore {
  isMounted: boolean;
  mount: () => void;
  friendList: (JwtPayload.FriendToken & JWTPayload)[];
  setFriendList: (friendList: (JwtPayload.FriendToken & JWTPayload)[]) => void;
  isLimitedAddFriend: boolean;
}

export const useFriendStore = create<FriendStore>((set) => ({
  isMounted: false,
  mount: () => set({ isMounted: true }),
  friendList: [],
  setFriendList: (friendList) => {
    const isLimitedAddFriend = MAX_FRIEND_COUNT <= friendList.length;
    set({ friendList, isLimitedAddFriend });
  },
  isLimitedAddFriend: false,
}));
