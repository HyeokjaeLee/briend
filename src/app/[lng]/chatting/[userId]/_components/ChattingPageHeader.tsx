'use client';

import { BackHeader, ConnectionIndicator } from '@/components';
import { usePeerStore } from '@/stores';

interface ChattingPageHeaderProps {
  userId: string;
}

export const ChattingPageHeader = ({ userId }: ChattingPageHeaderProps) => {
  const connection = usePeerStore((state) =>
    state.friendConnectionMap.get(userId),
  );

  const firendConnectionMap = usePeerStore(
    (state) => state.friendConnectionMap,
  );

  console.log(firendConnectionMap);

  return (
    <BackHeader>
      <ConnectionIndicator connection={connection} />
    </BackHeader>
  );
};
