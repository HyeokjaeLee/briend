import { Spinner } from '@radix-ui/themes';
import type { Dayjs } from 'dayjs';

import { IS_TOUCH_DEVICE } from '@/constants';
import { MESSAGE_STATE } from '@/database/indexed';
import { useLanguage, useLongPress } from '@/hooks';
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
        {state === MESSAGE_STATE.SENT ? <Spinner size="1" /> : null}
        <pre
          className={cn(
            'whitespace-pre-wrap break-all font-pretendard cursor-pointer transition-colors',
            'py-2 px-4 rounded-xl rounded-tr-none w-fit',
            'bg-slate-100 active:bg-slate-300 duration-75',
            {
              'hover:bg-slate-200': !IS_TOUCH_DEVICE,
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
