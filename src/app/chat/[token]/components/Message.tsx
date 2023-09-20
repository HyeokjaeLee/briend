import dayjs from 'dayjs';

import { cleanClassName } from '@/utils';
import { Tooltip } from '@hyeokjaelee/pastime-ui';

export interface PrevMessageInfo {
  isMine: boolean;
  createdAt: Date;
}
interface MessageProps {
  prevMessageInfo?: PrevMessageInfo;
  translatedMessage?: string;
  originalMessage: string;
  isMine: boolean;
  userName: string;
  createdAt?: Date;
  messageCount: number;
}

const DAY_FORMAT = 'YY. MM. DD. HH:mm';
const TIME_FORMAT = 'HH:mm';

export const Message = ({
  prevMessageInfo,
  translatedMessage,
  originalMessage,
  isMine,
  userName,
  createdAt,
  messageCount,
}: MessageProps) => {
  let emojo = '🥳';

  if (messageCount > 100) emojo = '🤭';
  else if (messageCount > 50) emojo = '😎';
  else if (messageCount > 20) emojo = '🤩';
  else if (messageCount > 10) emojo = '😊';
  else if (messageCount > 5) emojo = '😀';

  const isContinuousUserMessage = prevMessageInfo?.isMine === isMine;

  const isOpponentNewMessage = !isMine && !isContinuousUserMessage;
  const isOpponentContinuousMessage = !isMine && isContinuousUserMessage;

  const timeText = dayjs(createdAt).format(
    dayjs().isSame(createdAt, 'day') ? TIME_FORMAT : DAY_FORMAT,
  );

  const isSameTime = prevMessageInfo
    ? dayjs(createdAt).isSame(prevMessageInfo.createdAt, 'minute')
    : false;

  return (
    <li
      className={cleanClassName(
        `flex gap-2 last:animate-fade-in ${isMine && 'flex-row-reverse'}`,
      )}
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
  );
};
