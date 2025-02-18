import { Skeleton } from '@radix-ui/themes';

import { ProfileImage } from '@/components';
import { IS_TOUCH_DEVICE } from '@/constants';
import { useLanguage, useLongPress } from '@/hooks';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

import type { CommonMessageItemProps } from './SenderMessageItem';

interface MessageItemProps extends CommonMessageItemProps {
  profileImageSrc?: string;
  nickname: string;
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
  isSelected,
  onClick,
  onLongPress,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isoDate = formatISODate(date);

  const { isPressing, register } = useLongPress({
    onLongPress,
    enable: onLongPress === onClick,
  });

  const hasUnderTimeText = isSameUser && !isSameTime;

  return (
    <article className={cn('flex mx-4 my-1', isSameUser ? 'gap-2' : 'gap-4')}>
      {isSameUser ? (
        <div className="flex h-5 w-14 items-center justify-end" />
      ) : (
        <Skeleton loading={isLoading}>
          <ProfileImage size="4" src={profileImageSrc} />
        </Skeleton>
      )}
      <section className={cn(!hasUnderTimeText && 'flex-1')}>
        {isSameUser ? null : (
          <header className="flex w-full flex-wrap items-center gap-2">
            <strong>{nickname}</strong>
            {isSameTime ? null : (
              <div className="h-fit flex-1 gap-2 flex-center">
                <hr className="ml-auto h-px w-full min-w-1 flex-1 rounded-r-full border-none bg-gradient-to-r from-transparent to-slate-300" />
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
          </header>
        )}
        <pre
          {...register}
          className={cn(
            'w-fit cursor-pointer whitespace-pre-wrap break-all font-pretendard',
            'active:bg-slate-200 duration-75 rounded-md',
            {
              'hover:bg-slate-100': !IS_TOUCH_DEVICE,
              'bg-slate-100': isPressing,
              'bg-slate-200': isSelected,
            },
          )}
          onClick={onClick}
        >
          {message}
        </pre>
      </section>
      {hasUnderTimeText ? (
        <div className="mt-auto h-fit flex-1 gap-2 flex-center">
          <hr className="ml-auto h-px w-full min-w-1 flex-1 rounded-r-full border-none bg-gradient-to-r from-transparent to-slate-300" />
          <time
            className="text-nowrap rounded-full text-xs text-slate-500"
            dateTime={isoDate}
          >
            {formatLocalizedDate(date, lng, {
              time: true,
            })}
          </time>
        </div>
      ) : null}
    </article>
  );
};
