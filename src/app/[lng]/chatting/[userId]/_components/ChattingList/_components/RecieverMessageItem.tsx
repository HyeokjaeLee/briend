import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import { ProfileImage } from '@/components';
import { useLanguage } from '@/hooks';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';
import { Skeleton } from '@radix-ui/themes';

interface MessageItemProps {
  profileImageSrc?: string;
  nickname: string;
  date: Dayjs;
  isSameUser: boolean;
  isSameTime: boolean;
  message: string;
  isLoading: boolean;
}

export const RecieverMessageItem = ({
  profileImageSrc,
  nickname,
  isSameUser,
  date,
  isSameTime,
  message,
  isLoading,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  const isoDate = formatISODate(date);

  return (
    <div className={cn('px-4', isSameUser ? 'py-1' : 'py-2')}>
      <article className={cn('flex', isSameUser ? 'gap-2' : 'gap-4')}>
        {isSameUser ? (
          <div className="flex h-5 w-14 items-center justify-end" />
        ) : (
          <Skeleton loading={isLoading}>
            <ProfileImage size="4" src={profileImageSrc} />
          </Skeleton>
        )}
        <section>
          {isSameUser ? null : (
            <header className="flex flex-wrap items-center gap-2">
              <strong>{nickname}</strong>
              <time className="text-xs text-slate-500" dateTime={isoDate}>
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
            </header>
          )}
          <pre className="whitespace-pre-wrap break-all font-pretendard">
            {message}
          </pre>
        </section>
        {!isSameUser || isSameTime ? null : (
          <div className="mt-auto h-fit flex-1 gap-2 flex-center">
            <hr className="ml-auto h-0.5 w-full min-w-1 max-w-8 flex-1 rounded-r-full border-none bg-gradient-to-r from-transparent to-slate-500" />
            <time
              className="text-nowrap rounded-full text-xs text-slate-500"
              dateTime={isoDate}
            >
              {formatLocalizedDate(date, lng, {
                time: true,
              })}
            </time>
          </div>
        )}
      </article>
    </div>
  );
};
