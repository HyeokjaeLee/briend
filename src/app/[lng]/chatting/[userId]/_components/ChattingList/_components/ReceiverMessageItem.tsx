import { Avatar } from '@/components';
import { useLanguage } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

import type { ReceiverData } from '../../../_hooks/useReceiverData';
import { useTranslateSearchParam } from '../../../_hooks/useTranslateSearchParam';
import type { CommonMessageItemProps } from './SenderMessageItem';

interface MessageItemProps extends CommonMessageItemProps {
  receiverData: ReceiverData;
  isSameUser: boolean;
}

export const ReceiverMessageItem = ({
  isSameUser,
  date,
  isSameTime,
  message,
  receiverData,
  translatedMessage,
}: MessageItemProps) => {
  const { lng } = useLanguage();

  const isoDate = formatISODate(date);

  const hasUnderTimeText = isSameUser && !isSameTime;

  const isTouchDevice = useGlobalStore((state) => state.isTouchDevice);

  const { isReceiverLanguage } = useTranslateSearchParam();

  return (
    <article className={cn('mx-4 my-1 flex gap-4')}>
      {isSameUser ? (
        <div className="flex h-5 w-14 items-center justify-end" />
      ) : (
        <Avatar
          size={14}
          src={receiverData.profileImage}
          userId={receiverData.id}
        />
      )}
      <section className={cn(!hasUnderTimeText && 'flex-1')}>
        {isSameUser ? null : (
          <header className="flex w-full flex-wrap items-center gap-2">
            <strong>{receiverData.name}</strong>
            {isSameTime ? null : (
              <div className="flex-center h-fit flex-1 gap-2">
                <hr className="bg-linear-to-r ml-auto h-px w-full min-w-1 flex-1 rounded-r-full border-none from-transparent to-slate-300" />
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
          className={cn(
            'font-pretendard w-fit cursor-pointer whitespace-pre-wrap break-all',
            'rounded-md duration-75 active:bg-slate-200',
            {
              'hover:bg-slate-100': !isTouchDevice,
            },
          )}
        >
          {isReceiverLanguage ? message : translatedMessage || message}
        </pre>
      </section>
      {hasUnderTimeText ? (
        <div className="flex-center mt-auto h-fit flex-1 gap-2">
          <hr className="bg-linear-to-r ml-auto h-px w-full min-w-1 flex-1 rounded-r-full border-none from-transparent to-slate-300" />
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
