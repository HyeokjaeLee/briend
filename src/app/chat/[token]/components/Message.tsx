import dayjs from 'dayjs';

import { forwardRef } from 'react';

import { cleanClassName } from '@/utils';
import { Spinner, Tooltip } from '@hyeokjaelee/pastime-ui';

export interface PrevMessageInfo {
  isMine: boolean;
  createdAt: Date;
}
interface MessageProps {
  prevMessageInfo?: PrevMessageInfo;
  translatedMessage?: string;
  originalMessage: string;
  isMine: boolean;
  userName?: string;
  createdAt: Date;
  messageCount?: number;
  isLoading?: boolean;
}

export const Message = forwardRef<HTMLLIElement, MessageProps>(
  (
    {
      prevMessageInfo,
      translatedMessage,
      originalMessage,
      isMine,
      userName,
      createdAt,
      messageCount = 0,
      isLoading,
    }: MessageProps,
    ref,
  ) => {
    let emojo = '🥳';

    if (messageCount > 100) emojo = '🤭';
    else if (messageCount > 50) emojo = '😎';
    else if (messageCount > 20) emojo = '🤩';
    else if (messageCount > 10) emojo = '😊';
    else if (messageCount > 5) emojo = '😀';

    const isContinuousUserMessage = prevMessageInfo?.isMine === isMine;

    const isOpponentNewMessage = !isMine && !isContinuousUserMessage;
    const isOpponentContinuousMessage = !isMine && isContinuousUserMessage;
    const isSameDay = prevMessageInfo
      ? dayjs(createdAt).isSame(prevMessageInfo.createdAt, 'day')
      : false;

    const timeText = dayjs(createdAt).format('HH:mm');

    const isSameTime = prevMessageInfo
      ? dayjs(createdAt).isSame(prevMessageInfo.createdAt, 'minute')
      : false;

    return (
      <>
        {isSameDay || isLoading ? null : (
          <li className="flex items-center gap-2 animate-fade-in">
            <hr className="flex-1" />
            <span className="text-sm">
              {dayjs(createdAt).format('YYYY. MM. DD')}
            </span>
            <hr className="flex-1" />
          </li>
        )}
        <li
          className={cleanClassName(
            `flex gap-2 last:animate-fade-in ${isMine && 'flex-row-reverse'}`,
          )}
          ref={ref}
        >
          {isOpponentNewMessage ? (
            <div
              className={cleanClassName(
                `whitespace-nowrap rounded-full w-11 h-11 font-semibold flex items-center justify-center text-xl bg-slate-700`,
              )}
            >
              {emojo}
            </div>
          ) : null}
          <div
            className={cleanClassName(
              `${isOpponentContinuousMessage && 'ml-[3.25rem]'}`,
            )}
          >
            {isOpponentNewMessage ? <small>{userName}</small> : null}
            <Tooltip>
              <Tooltip.Area
                className={cleanClassName(
                  `flex gap-1 ${isMine && 'flex-row-reverse '} items-start`,
                )}
              >
                {isLoading ? <Spinner className="inline-block" /> : null}
                <div
                  className={`whitespace-pre-wrap rounded-xl bg-gray-200 dark:bg-slate-600 shadow-sm dark:shadow-xl py-2 px-4 flex-1 break-all max-w-fit ${
                    !isContinuousUserMessage &&
                    (isMine ? 'rounded-se-none' : 'rounded-ss-none')
                  }`}
                >
                  {(isMine ? originalMessage : translatedMessage) ??
                    originalMessage}
                </div>
                {!isSameTime || !isContinuousUserMessage ? (
                  <small>{timeText}</small>
                ) : null}
              </Tooltip.Area>
              <Tooltip.Content className="font-light">
                {isMine ? translatedMessage : originalMessage}
              </Tooltip.Content>
            </Tooltip>
          </div>
        </li>
      </>
    );
  },
);

Message.displayName = 'Message';
