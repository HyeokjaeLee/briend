'use client';

import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';

import { Virtuoso } from 'react-virtuoso';

import { useRealtimeDatabase } from '@/database/firebase/client';
import type { ChatItem } from '@/database/firebase/type';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { MyMessageItem } from './_components/MyMessageItem';
import { RecieverMessageItem } from './_components/RecieverMessageItem';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  receiverId: string;
  receiverProfileImage?: string;
  receiverNickname: string;
  isLoading: boolean;
}

export const ChattingList = ({
  receiverId,
  receiverProfileImage,
  receiverNickname,
  isLoading,
}: ChattingListProps) => {
  const { messageList } = useMessageSync(receiverId);

  const auth = getAuth();

  const receiverNotReadMessages = useRealtimeDatabase<ChatItem['msg']>(
    'onValue',
    `${receiverId}/chat/${auth.currentUser?.uid}/msg`,
  );

  if (!messageList) return null;

  if (!messageList.length) return <EmptyTemplate />;

  return (
    <Virtuoso
      className="animate-fade animate-duration-1000"
      data={messageList}
      followOutput="smooth"
      itemContent={(index, { isMine, message, timestamp, state }) => {
        const prevMessage = index ? messageList[index - 1] : null;

        const isSameUser = prevMessage ? isMine === prevMessage.isMine : false;

        const date = dayjs(timestamp);

        const isSameTime = prevMessage
          ? dayjs(timestamp).isSame(dayjs(prevMessage.timestamp), 'minute')
          : false;

        return isMine ? (
          <MyMessageItem
            date={date}
            isMine={isMine}
            isSameUser={isSameUser}
            message={message}
            state={state}
          />
        ) : (
          <RecieverMessageItem
            date={date}
            isLoading={isLoading}
            isSameTime={isSameTime}
            isSameUser={isSameUser}
            message={message}
            nickname={receiverNickname}
            profileImageSrc={receiverProfileImage}
          />
        );
      }}
    />
  );
};
