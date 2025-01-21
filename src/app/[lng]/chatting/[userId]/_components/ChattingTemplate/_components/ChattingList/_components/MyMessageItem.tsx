import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import type { MessageTableItem } from '@/database/indexed-db';
import { useLanguage } from '@/hooks';
import { cn, formatLocalizedDate } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface MessageItemProps extends MessageTableItem {
  isMine: boolean;
  isSameUser: boolean;
}

export const MyMessageItem = ({
  message,
  timestamp,
  isMine,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const date = dayjs(timestamp);

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  return (
    <div className="px-4 py-2">
      <article>
        <header
          className={cn('flex flex-wrap items-center gap-1', {
            'flex-row-reverse': isMine,
          })}
        >
          <time
            className="text-xs text-slate-500"
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
          <Spinner size="1" />
        </header>
        <pre
          className={cn('whitespace-pre-wrap break-all font-pretendard', {
            'bg-slate-100 py-2 px-4 rounded-xl rounded-tr-none w-fit ml-auto':
              isMine,
          })}
        >
          {message}
        </pre>
      </article>
    </div>
  );
};
