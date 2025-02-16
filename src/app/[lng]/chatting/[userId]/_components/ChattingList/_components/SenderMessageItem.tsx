import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import { IS_TOUCH_DEVICE } from '@/constants';
import { MESSAGE_STATE, type Message } from '@/database/indexed';
import { useLanguage, useLongPress } from '@/hooks';
import { cn, formatLocalizedDate } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface MessageItemProps extends Pick<Message, 'message' | 'state'> {
  isSameUser: boolean;
  isSameTime: boolean;
  date: Dayjs;
  onLongPress: () => void;
  isSelected: boolean;
  onClick: () => void;
}

export const SenderMessageItem = ({
  message,
  date,
  isSameTime,
  state,
  isSameUser,
  onLongPress,
  isSelected,
  onClick,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  const { isPressing, register } = useLongPress({
    onLongPress,
    enable: onLongPress === onClick,
  });

  return (
    <article
      className={cn(
        'flex flex-col items-end gap-1 mx-4',
        isSameUser ? 'my-1' : 'my-2',
      )}
    >
      {isSameTime ? null : (
        <time
          className="w-fit text-xs text-slate-500"
          dateTime={date.format('YYYY-MM-DDTHH:mm:ss.SSSZ')}
        >
          {isToday
            ? `${t('today')} ${formatLocalizedDate(date, lng, {
                time: true,
              })}`
            : formatLocalizedDate(date, lng, {
                time: true,
                day: true,
                withYear: !isThisYear,
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
