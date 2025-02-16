'use client';

import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';

import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Checkbox } from '@/components';
import { useRealtimeDatabase } from '@/database/firebase/client';
import type { ChatItem } from '@/database/firebase/type';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { MessageModal } from './_components/MessageModal';
import { RecieverMessageItem } from './_components/RecieverMessageItem';
import { SenderMessageItem } from './_components/SenderMessageItem';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  receiverId: string;
  receiverProfileImage?: string;
  receiverNickname: string;
  isLoading: boolean;
  messageIdsForDelete: string[];
  onAddMessageIdForDelete: (messageId: string) => void;
  onRemoveMessageIdForDelete: (messageId: string) => void;
}

export const ChattingList = ({
  receiverId,
  receiverProfileImage,
  receiverNickname,
  isLoading,
  messageIdsForDelete,
  onAddMessageIdForDelete,
  onRemoveMessageIdForDelete,
}: ChattingListProps) => {
  const { messageList } = useMessageSync(receiverId);

  const auth = getAuth();

  const receiverNotReadMessages = useRealtimeDatabase<ChatItem['msg']>(
    'onValue',
    `${receiverId}/chat/${auth.currentUser?.uid}/msg`,
  );

  const [selectedMessageId, setSelectedMessageId] = useState<string>();

  if (!messageList) return null;

  if (!messageList.length) return <EmptyTemplate />;

  const isDeleteMode = !!messageIdsForDelete.length;

  return (
    <>
      <Virtuoso
        className="animate-fade animate-duration-1000"
        data={messageList}
        followOutput="smooth"
        itemContent={(index, { isMine, message, timestamp, state, id }) => {
          const prevMessage = index ? messageList[index - 1] : null;

          const isSameUser = prevMessage
            ? isMine === prevMessage.isMine
            : false;

          const date = dayjs(timestamp);

          const isSameTime = prevMessage
            ? dayjs(timestamp).isSame(dayjs(prevMessage.timestamp), 'minute')
            : false;

          const isSelected = selectedMessageId === id;

          const handleLongPress = () => setSelectedMessageId(id);

          const isCheckedForDelete = messageIdsForDelete.includes(id);

          const handleCheckForDelete = () => {
            if (isCheckedForDelete) onRemoveMessageIdForDelete(id);
            else onAddMessageIdForDelete(id);
          };

          const handleClick = isDeleteMode
            ? handleCheckForDelete
            : handleLongPress;

          return (
            <div className="flex w-full items-center gap-2">
              {isDeleteMode ? (
                <Checkbox
                  checked={isCheckedForDelete}
                  className="ml-2 animate-fade-right animate-duration-100"
                  onChange={handleCheckForDelete}
                />
              ) : null}
              <div className="flex-1">
                {isMine ? (
                  <SenderMessageItem
                    date={date}
                    isSameTime={isSameTime}
                    isSameUser={isSameUser}
                    isSelected={isSelected}
                    message={message}
                    state={state}
                    onClick={handleClick}
                    onLongPress={handleLongPress}
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
                )}
              </div>
            </div>
          );
        }}
      />
      <MessageModal
        selectedMessageId={selectedMessageId}
        onClickDeleteModeButton={onAddMessageIdForDelete}
        onClose={() => setSelectedMessageId(undefined)}
      />
    </>
  );
};
