import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import { MESSAGE_STATE, type Message } from '@/database/indexed';
import { useLanguage } from '@/hooks';
import { cn, formatLocalizedDate } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface MessageItemProps
  extends Pick<Message, 'isMine' | 'message' | 'state'> {
  isSameUser: boolean;
  isSameTime: boolean;
  date: Dayjs;
}

export const SenderMessageItem = ({
  message,
  date,
  isMine,
  isSameTime,
  state,
  isSameUser,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  return (
    <article
      className={cn(
        'flex flex-col items-end gap-1 px-4',
        isSameUser ? 'py-1' : 'py-2',
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
          className={cn('whitespace-pre-wrap break-all font-pretendard', {
            'bg-slate-100 py-2 px-4 rounded-xl rounded-tr-none w-fit': isMine,
          })}
        >
          {message}
        </pre>
      </div>
    </article>
  );
};
