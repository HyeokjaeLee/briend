'use client';

import dayjs from 'dayjs';
import { RiCalendarCheckFill, RiSunFill } from 'react-icons/ri';
import { Virtuoso } from 'react-virtuoso';

import { useTranslation } from '@/configs/i18n/client';
import { useLanguage } from '@/hooks';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

import type { ReceiverData } from '../../_hooks/useReceiverData';
import { EmptyTemplate } from './_components/EmptyTemplate';
import { ReceiverMessageItem } from './_components/ReceiverMessageItem';
import type { CommonMessageItemProps } from './_components/SenderMessageItem';
import { SenderMessageItem } from './_components/SenderMessageItem';
import { useMessageSync } from './_hooks/useMessageSync';

interface ChattingListProps {
  receiverData: ReceiverData;
}

export const ChattingList = ({ receiverData }: ChattingListProps) => {
  const { messageList } = useMessageSync(receiverData.id);

  const { t } = useTranslation('global');

  const { lng } = useLanguage();

  if (!messageList) return <div className="size-full" />;

  if (!messageList.length) return <EmptyTemplate />;

  const today = dayjs();

  return (
    <Virtuoso
      className="animate-fade animate-duration-1000"
      data={messageList}
      followOutput="smooth"
      initialTopMostItemIndex={messageList.length - 1}
      itemContent={(
        index,
        { isMine, message, timestamp, state, id, translatedMessage },
      ) => {
        const prevMessage = index ? messageList[index - 1] : null;

        const isSameUser = prevMessage ? isMine === prevMessage.isMine : false;

        const date = dayjs(timestamp);
        const prevDate = prevMessage ? dayjs(prevMessage.timestamp) : null;
        const isSameDate = prevDate ? date.isSame(prevDate, 'date') : false;

        const isSameTime =
          isSameDate && prevDate ? date.isSame(prevDate, 'minute') : false;

        const isToday = date.isSame(today, 'date');
        const isThisYear = date.isSame(today, 'year');

        const commonProps: CommonMessageItemProps = {
          date,
          isSameTime,
          message,
          translatedMessage,
        };

        return (
          <div className="w-full flex-col" key={id}>
            {isSameDate ? null : (
              <div
                className={cn(
                  'flex-center mx-2 mb-1 mt-5 w-fit min-w-24 gap-1',
                  'mx-auto rounded-full text-xs font-semibold',
                  'text-slate-500',
                  {
                    'animate-bounce': isToday,
                  },
                )}
              >
                {isToday ? (
                  <>
                    <RiSunFill className="size-4" />
                    <time dateTime={formatISODate(date)}>{t('today')}</time>
                  </>
                ) : (
                  <>
                    <RiCalendarCheckFill className="size-4" />
                    <time dateTime={formatISODate(date)}>
                      {formatLocalizedDate(date, lng, {
                        day: true,
                        year: !isThisYear,
                      })}
                    </time>
                  </>
                )}
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <div className="flex-1">
                {isMine ? (
                  <SenderMessageItem {...commonProps} state={state} />
                ) : (
                  <ReceiverMessageItem
                    {...commonProps}
                    isSameUser={isSameUser}
                    receiverData={receiverData}
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
