'use client';

import { useEffect, useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { useProfileImage, useUserData } from '@/hooks';
import { useFriendStore } from '@/stores';
import { assert } from '@/utils';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { MessageItem } from './_components/MessageItem';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  friendUserId: string;
}

export const ChattingList = ({ friendUserId }: ChattingListProps) => {
  const { messageList } = useMessageSync(friendUserId);

  const { profileImageSrc: myProfileImageSrc } = useProfileImage();
  const { profileImageSrc: friendProfileImageSrc } =
    useProfileImage(friendUserId);
  const isAtBottomRef = useRef(true);
  const friendNickname = useFriendStore(
    (state) =>
      state.friendList.find((friend) => friend.userId === friendUserId)
        ?.nickname,
  );

  const { user } = useUserData();

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const myNickname = user?.name ?? 'Me';

  if (!messageList) return <EmptyTemplate />;

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messageList}
      followOutput="smooth"
      initialItemCount={messageList.length - 1}
      initialTopMostItemIndex={messageList.length - 1}
      itemContent={(index, message) => {
        assert(friendNickname);

        const isMine = message.fromUserId !== friendUserId;

        const isSameUser = index
          ? message.fromUserId === messageList[index - 1].fromUserId
          : false;

        return (
          <MessageItem
            {...message}
            isMine={isMine}
            isSameUser={isSameUser}
            nickname={isMine ? myNickname : friendNickname}
            profileImageSrc={isMine ? myProfileImageSrc : friendProfileImageSrc}
          />
        );
      }}
    />
  );
};
