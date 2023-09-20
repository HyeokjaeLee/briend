import dayjs from 'dayjs';

import { cleanClassName } from '@/utils';
import { Tooltip } from '@hyeokjaelee/pastime-ui';

interface MessageProps {
  translatedMessage?: string;
  originalMessage: string;
  isMine: boolean;
  isHost: boolean;
  userName: string;
  createdAt?: Date;
}

export const Message = ({
  translatedMessage,
  originalMessage,
  isMine,
  isHost,
  userName,
  createdAt,
}: MessageProps) => {
  const isToday = dayjs().isSame(createdAt, 'day');

  return (
    <li
      className={cleanClassName(`flex gap-2 ${isMine && 'flex-row-reverse'}`)}
    >
      <Tooltip>
        <Tooltip.Area>
          <div
            className={cleanClassName(
              `whitespace-nowrap rounded-full w-11 h-11 font-semibold flex items-center justify-center text-xl ${
                (isMine && isHost) || (!isMine && !isHost)
                  ? 'bg-sky-400'
                  : 'bg-red-400'
              } text-white`,
            )}
          >
            {userName[0]}
          </div>
        </Tooltip.Area>
        <Tooltip.Content>{userName}</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Area>
          <div>
            <small>
              {dayjs(createdAt).format(isToday ? 'HH:mm' : 'YY. MM. DD. HH:mm')}
            </small>
            <div
              className={`whitespace-pre-wrap rounded-2xl ${
                isMine ? 'rounded-se-none' : 'rounded-ss-none'
              } bg-gray-200 dark:bg-slate-600 shadow-sm dark:shadow-xl py-2 px-4 flex-1 break-all max-w-fit`}
            >
              {(isMine ? originalMessage : translatedMessage) ??
                originalMessage}
            </div>
          </div>
        </Tooltip.Area>
        <Tooltip.Content className="font-light">
          {isMine ? translatedMessage : originalMessage}
        </Tooltip.Content>
      </Tooltip>
    </li>
  );
};
