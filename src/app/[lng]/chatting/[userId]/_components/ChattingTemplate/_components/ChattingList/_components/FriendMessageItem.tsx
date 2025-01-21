import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import { ProfileImage } from '@/components';
import { useLanguage } from '@/hooks';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface MessageItemProps {
  profileImageSrc?: string;
  nickname: string;
  date: Dayjs;
  isSameUser: boolean;
  isSameTime: boolean;
  children: string;
}

export const FriendMessageItem = ({
  profileImageSrc,
  nickname,
  isSameUser,
  date,
  isSameTime,
  children,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  const isoDate = formatISODate(date);

  return (
    <div
      className={cn('px-4', {
        'py-2': !isSameUser,
      })}
    >
      <article className={cn('flex', isSameUser ? 'py-1 gap-2' : 'gap-4')}>
        {isSameUser ? (
          <div className="flex h-5 w-14 items-center justify-end">
            {isSameTime ? (
              <Spinner className="mt-2" size="1" />
            ) : (
              <time
                className="mt-1 text-nowrap text-xs text-slate-500"
                dateTime={isoDate}
              >
                {formatLocalizedDate(date, lng, {
                  time: true,
                })}
              </time>
            )}
          </div>
        ) : (
          <ProfileImage size="4" src={profileImageSrc} />
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
              <Spinner size="1" />
            </header>
          )}
          <pre className="whitespace-pre-wrap break-all font-pretendard">
            {children}
          </pre>
        </section>
      </article>
    </div>
  );
};
