import { cleanClassName } from '@/utils';
import { Tooltip } from '@hyeokjaelee/pastime-ui';

interface MessageProps {
  translatedMessage?: string;
  originalMessage: string;
  isMine: boolean;
  isHost: boolean;
  userName: string;
}

/**
 * 
  createdAt?: Date;
  isLast?: boolean;
 */

export const Message = ({
  translatedMessage,
  originalMessage,
  isMine,
  isHost,
  userName,
}: MessageProps) => (
  <li className={cleanClassName(`flex gap-2 ${isMine && 'flex-row-reverse'}`)}>
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
      <Tooltip.Content>ss</Tooltip.Content>
    </Tooltip>
    <div
      className={`font-semibold whitespace-pre-wrap rounded-2xl ${
        isMine ? 'rounded-se-none' : 'rounded-ss-none'
      } bg-yellow-200 dark:bg-slate-600 shadow-md dark:shadow-xl py-2 px-4 flex-1 break-all max-w-fit mt-5`}
    >
      {(isMine ? originalMessage : translatedMessage) ?? originalMessage}
    </div>
  </li>
);
