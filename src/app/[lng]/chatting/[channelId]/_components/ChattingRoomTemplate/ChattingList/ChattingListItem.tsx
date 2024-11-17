import dayjs from 'dayjs';

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

  const prevDayjsDate = dayjs(prevMessage?.timestamp);
  const dayjsDate = dayjs(message.timestamp);

  const prevDisplayDate = prevDayjsDate.isSame(dayjsDate, 'day')
    ? prevDayjsDate.format('HH:mm')
    : prevDayjsDate.format('YYYY.MM.DD');

  const displayDate = dayjsDate.isSame(new Date(), 'day')
    ? dayjsDate.format('HH:mm')
    : dayjsDate.format('YYYY.MM.DD');

  const isSameDate = prevDisplayDate === displayDate;

  return (
    <li id={id}>
      <div
        className={cn('flex gap-2', {
          'flex-row-reverse': isMine,
        })}
      >
        {displayProfile ? (
          <div className="size-12 rounded-full bg-blue-100 text-lg flex-center">
            {otherEmoji}
          </div>
        ) : null}
        <div className="max-w-[90%]">
          {displayProfile ? (
            <small className="text-sm font-semibold">{otherName}</small>
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
            date={!isBeforeFromOther && isSameDate ? null : displayDate}
            isSendComplete={isSendingCompleteMessage}
            state={message.state}
            onSendComplete={onSendComplete}
          />
        </div>
      </div>
    </li>
  );
};
