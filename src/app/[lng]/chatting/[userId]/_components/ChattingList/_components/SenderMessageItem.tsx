import type { Dayjs } from 'dayjs';

import { Spinner } from '@/components';
import { MESSAGE_STATE } from '@/database/indexed';
import { useLanguage, useLongPress } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

export interface CommonMessageItemProps {
  message: string;
  isSameUser: boolean;
  isSameTime: boolean;
  date: Dayjs;
  onLongPress: () => void;
  isSelected: boolean;
  onClick: () => void;
}
export interface SenderMessageItemProps extends CommonMessageItemProps {
  state: MESSAGE_STATE;
}

export const SenderMessageItem = ({
  message,
  date,
  isSameTime,
  state,
  onLongPress,
  isSelected,
  onClick,
}: SenderMessageItemProps) => {
  const { lng } = useLanguage();

  const { isPressing, register } = useLongPress({
    onLongPress,
    enable: onLongPress === onClick,
  });

  const isTouchDevice = useGlobalStore((state) => state.isTouchDevice);

  return (
    <article className="mx-4 my-1 flex flex-col items-end gap-1">
      {isSameTime ? null : (
        <time
          className="w-fit text-xs text-slate-500"
          dateTime={formatISODate(date)}
        >
          {formatLocalizedDate(date, lng, {
            time: true,
          })}
        </time>
      )}
      <div className="flex items-end gap-2">
        {state === MESSAGE_STATE.SENT ? <Spinner className="size-16" /> : null}
        <pre
          className={cn(
            'font-pretendard cursor-pointer whitespace-pre-wrap break-all transition-colors',
            'w-fit rounded-xl rounded-tr-none px-4 py-2',
            'bg-slate-100 duration-75 active:bg-slate-300',
            {
              'hover:bg-slate-200': !isTouchDevice,
              'bg-slate-200': isPressing,
              'bg-slate-300': isSelected,
            },
          )}
          {...register}
          onClick={onClick}
        >
          {message}
        </pre>
      </div>
    </article>
  );
};
