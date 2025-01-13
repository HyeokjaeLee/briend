'use client';

import { Virtuoso } from 'react-virtuoso';

import { useProfileImage } from '@/hooks';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { MessageItem } from './_components/MessageItem';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  friendUserId: string;
}

export const ChattingList = ({ friendUserId }: ChattingListProps) => {
  const { messageList } = useMessageSync(friendUserId);

  const { profileImageSrc } = useProfileImage();

  return messageList?.length ? (
    <Virtuoso
      as="ul"
      className="mx-4 flex h-full flex-col"
      data={messageList}
      followOutput="smooth"
      initialTopMostItemIndex={messageList.length - 1} // 최신 메시지부터 보여주기
      itemContent={(index, message) => (
        <MessageItem {...message} profileImageSrc={profileImageSrc} />
      )}
    />
  ) : (
    <EmptyTemplate />
  );
};
