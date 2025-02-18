'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { RiCalendarCheckFill, RiSunFill } from 'react-icons/ri';
import { Virtuoso } from 'react-virtuoso';

import { useTranslation } from '@/app/i18n/client';
import { Checkbox } from '@/components';
import { useLanguage } from '@/hooks';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

import { EmptyTemplate } from './_components/EmptyTemplate';
import { MessageModal } from './_components/MessageModal';
import { RecieverMessageItem } from './_components/RecieverMessageItem';
import type { CommonMessageItemProps } from './_components/SenderMessageItem';
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

  const { t } = useTranslation('global');

  const [selectedMessageId, setSelectedMessageId] = useState<string>();

  const { lng } = useLanguage();

  if (!messageList) return null;

  if (!messageList.length) return <EmptyTemplate />;

  const isDeleteMode = !!messageIdsForDelete.length;

  const today = dayjs();

  return (
    <>
      <Virtuoso
        className="animate-fade animate-duration-1000"
        data={messageList}
        followOutput="smooth"
        initialTopMostItemIndex={messageList.length - 1}
        itemContent={(index, { isMine, message, timestamp, state, id }) => {
          const prevMessage = index ? messageList[index - 1] : null;

          const isSameUser = prevMessage
            ? isMine === prevMessage.isMine
            : false;

          const date = dayjs(timestamp);
          const prevDate = prevMessage ? dayjs(prevMessage.timestamp) : null;
          const isSameDate = prevDate ? date.isSame(prevDate, 'date') : false;

          const isSameTime =
            isSameDate && prevDate ? date.isSame(prevDate, 'minute') : false;

          const isSelected = selectedMessageId === id;

          const isCheckedForDelete = messageIdsForDelete.includes(id);

          const handleCheckForDelete = () => {
            if (isCheckedForDelete) onRemoveMessageIdForDelete(id);
            else onAddMessageIdForDelete(id);
          };

          const isToday = date.isSame(today, 'date');
          const isThisYear = date.isSame(today, 'year');

          const handleLongPress = () => setSelectedMessageId(id);

          const commonProps: CommonMessageItemProps = {
            date,
            isSameTime,
            isSameUser,
            isSelected,
            message,
            onClick: isDeleteMode ? handleCheckForDelete : handleLongPress,
            onLongPress: handleLongPress,
          };

          return (
            <div className="w-full flex-col">
              {isSameDate ? null : (
                <div
                  className={cn(
                    'flex-center w-fit gap-1 mt-5 mb-1 mx-2 min-w-24',
                    'mx-auto rounded-full text-xs font-semibold',
                    'text-slate-500',
                    {
                      'animate-bounce': isToday,
                    },
                  )}
                >
                  {isToday ? (
                    <>
                      <RiSunFill className="size-4" />
                      <time dateTime={formatISODate(date)}>{t('today')}</time>
                    </>
                  ) : (
                    <>
                      <RiCalendarCheckFill className="size-4" />
                      <time dateTime={formatISODate(date)}>
                        {formatLocalizedDate(date, lng, {
                          day: true,
                          year: !isThisYear,
                        })}
                      </time>
                    </>
                  )}
                </div>
              )}
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
                    <SenderMessageItem {...commonProps} state={state} />
                  ) : (
                    <RecieverMessageItem
                      {...commonProps}
                      isLoading={isLoading}
                      nickname={receiverNickname}
                      profileImageSrc={receiverProfileImage}
                    />
                  )}
                </div>
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
