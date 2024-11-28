import dayjs from 'dayjs';

import { Fragment } from 'react';
import { RiCalendar2Line } from 'react-icons/ri';
import reactScroll from 'react-scroll';

import type { ChattingMessage } from '@/stores/chatting-db.';
import { cn } from '@/utils/cn';

import { MessageState } from './MessageState';

interface ChattingListItemProps {
  prevMessage?: ChattingMessage;
  message: ChattingMessage;
  id?: string;
  myId: string;
  isMyLanguage: boolean;
  otherEmoji: string;
  otherName: string;
  hasSendingMessage: boolean;
  onSendComplete: () => void;
}

export const ChattingListItem = ({
  prevMessage,
  message,
  isMyLanguage,
  id,
  myId,
  otherEmoji,
  otherName,
  hasSendingMessage,
  onSendComplete,
}: ChattingListItemProps) => {
  const isMine = message.fromUserId === myId;

  const isBeforeFromOther = prevMessage?.fromUserId !== message.fromUserId;

  const displayProfile = isBeforeFromOther && !isMine;

  const isSendingCompleteMessage =
    message.state === 'receive' && hasSendingMessage;

  const displayMessage = isMyLanguage
    ? isMine
      ? message.message
      : message.translatedMessage
    : isMine
      ? message.translatedMessage
      : message.message;

  const prevTime = prevMessage && dayjs(prevMessage.timestamp);
  const time = dayjs(message.timestamp);

  const isSameDay = !!(prevTime && prevTime.isSame(time, 'day'));

  return (
    <Fragment key={id}>
      {isSameDay ? null : (
        <li
          className={cn(
            'px-4 py-2 size-fit flex-center gap-2 text-zinc-500',
            'my-4 mx-auto first:mt-0 cursor-pointer',
          )}
          onClick={() =>
            reactScroll.scroller.scrollTo(message.id, { smooth: true })
          }
        >
          <RiCalendar2Line className="size-4" />
          <time className="text-sm font-medium">
            {time.format('YYYY.MM.DD')}
          </time>
        </li>
      )}
      <li id={id}>
        <div
          className={cn('flex gap-2', {
            'flex-row-reverse': isMine,
          })}
          id={message.id}
        >
          {displayProfile ? (
            <div className="size-12 rounded-full bg-blue-100 text-lg flex-center">
              {otherEmoji}
            </div>
          ) : null}
          <div className="max-w-[90%]">
            {displayProfile ? (
              <small className="text-sm">{otherName}</small>
            ) : null}
            <article
              className={cn(
                'relative px-3 py-2 rounded-xl whitespace-pre size-fit',
                isMine ? 'bg-zinc-300' : 'bg-blue-300',
                {
                  'rounded-tr-none': isMine && isBeforeFromOther,
                  'rounded-tl-none': displayProfile,
                  'ml-14': !displayProfile && !isMine,
                },
              )}
            >
              {displayMessage}
            </article>
          </div>
          <div className="mt-auto">
            <MessageState
              isSendComplete={isSendingCompleteMessage}
              prevTime={prevTime}
              state={message.state}
              time={time}
              onSendComplete={onSendComplete}
            />
          </div>
        </div>
      </li>
    </Fragment>
  );
};
