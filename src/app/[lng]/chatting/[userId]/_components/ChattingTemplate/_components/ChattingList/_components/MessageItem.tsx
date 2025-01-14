import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18n/client';
import { ProfileImage } from '@/components';
import type { MessageTableItem } from '@/database/indexed-db';
import { useLanguage } from '@/hooks';
import { cn, formatLocalizedDate } from '@/utils';
import { Spinner } from '@radix-ui/themes';

// 로컬라이즈된 포맷 플러그인 추가

interface MessageItemProps extends MessageTableItem {
  profileImageSrc?: string;
  nickname: string;
  isMine: boolean;
  isSameUser: boolean;
}

//TODO: 아에 두개로 나누는게 나을듯.
export const MessageItem = ({
  message,
  timestamp,
  profileImageSrc,
  nickname,
  isMine,
  isSameUser,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const date = dayjs(timestamp);

  const isToday = date.isSame(dayjs(), 'day');
  const isThisYear = date.isSame(dayjs(), 'year');

  const { t } = useTranslation('global');

  return (
    <div className="px-4 py-2">
      <article
        className={cn('flex gap-4', {
          'flex-row-reverse': isMine,
        })}
      >
        {isMine ? null : <ProfileImage size="5" src={profileImageSrc} />}
        <section className="mt-2">
          <header
            className={cn('flex flex-wrap items-center gap-1', {
              'flex-row-reverse': isMine,
            })}
          >
            {isMine ? null : <strong className="">{nickname}</strong>}
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
        </section>
      </article>
    </div>
  );
};
