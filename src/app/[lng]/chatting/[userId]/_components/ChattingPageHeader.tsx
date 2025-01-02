'use client';

import { BackHeader, ConnectionIndicator } from '@/components';
import { usePeerStore } from '@/stores';

interface ChattingPageHeaderProps {
  userId: string;
}

export const ChattingPageHeader = ({ userId }: ChattingPageHeaderProps) => {
  const friendPeer = usePeerStore((state) =>
    state.friendConnections.data.get(userId),
  );

  return (
    <BackHeader>
      <ConnectionIndicator friendPeer={friendPeer} />
    </BackHeader>
  );
};
