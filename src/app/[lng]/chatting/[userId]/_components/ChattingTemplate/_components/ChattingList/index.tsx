'use client';

import dayjs from 'dayjs';

import { Virtuoso } from 'react-virtuoso';

import { useFriendStore } from '@/stores';
import { assert } from '@/utils';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { FriendMessageItem } from './_components/FriendMessageItem';
import { MyMessageItem } from './_components/MyMessageItem';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  friendUserId: string;
}

export const ChattingList = ({ friendUserId }: ChattingListProps) => {
  const { messageList } = useMessageSync(friendUserId);

  const friendNickname = useFriendStore(
    (state) =>
      state.friendList.find((friend) => friend.userId === friendUserId)
        ?.nickname,
  );

  if (!messageList) return null;

  if (!messageList.length) return <EmptyTemplate />;

  return (
    <Virtuoso
      className="animate-fade animate-duration-1000"
      data={messageList}
      followOutput="smooth"
      itemContent={(index, message) => {
        assert(friendNickname);

        const isMine = message.fromUserId !== friendUserId;
        const prevMessage = index ? messageList[index - 1] : null;

        const isSameUser = prevMessage
          ? message.fromUserId === prevMessage.fromUserId
          : false;

        const date = dayjs(message.timestamp);

        const isSameTime = prevMessage
          ? dayjs(message.timestamp).isSame(
              dayjs(prevMessage.timestamp),
              'minute',
            )
          : false;

        return isMine ? (
          <MyMessageItem {...message} isMine={isMine} isSameUser={isSameUser} />
        ) : (
          <FriendMessageItem
            date={date}
            isSameTime={isSameTime}
            isSameUser={isSameUser}
            nickname={friendNickname}
            profileImageSrc=""
          >
            {message.message}
          </FriendMessageItem>
        );
      }}
    />
  );
};
