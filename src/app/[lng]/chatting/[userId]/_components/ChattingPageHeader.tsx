'use client';

import { RiSettings2Fill, RiSettings2Line } from 'react-icons/ri';

import {
  BackHeader,
  ConnectionIndicator,
  CustomIconButton,
} from '@/components';
import { useFriendStore, usePeerStore } from '@/stores';

interface ChattingPageHeaderProps {
  userId: string;
}

export const ChattingPageHeader = ({ userId }: ChattingPageHeaderProps) => {
  const friendPeer = usePeerStore((state) =>
    state.friendConnections.data.get(userId),
  );

  const nickname = useFriendStore(
    (state) =>
      state.friendList.find((friend) => friend.userId === userId)?.nickname,
  );

  return (
    <BackHeader className="justify-between">
      <div className="w-fit gap-3 flex-center">
        <h1 className="truncate text-nowrap font-semibold">{nickname}</h1>
        <ConnectionIndicator friendPeer={friendPeer} />
      </div>
      <CustomIconButton size="3" variant="ghost">
        <RiSettings2Line className="size-6 text-slate-900" />
      </CustomIconButton>
    </BackHeader>
  );
};
