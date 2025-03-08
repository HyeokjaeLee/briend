import type { Dayjs } from 'dayjs';

import { Spinner } from '@/components';
import { MESSAGE_STATE } from '@/database/indexed';
import { useLanguage } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn, formatISODate, formatLocalizedDate } from '@/utils';

import { useTranslateSearchParam } from '../../../_hooks/useTranslateSearchParam';

export interface CommonMessageItemProps {
  message: string;
  translatedMessage: string;
  isSameTime: boolean;
  date: Dayjs;
}
export interface SenderMessageItemProps extends CommonMessageItemProps {
  state: MESSAGE_STATE;
}

export const SenderMessageItem = ({
  message,
  date,
  isSameTime,
  state,
  translatedMessage,
}: SenderMessageItemProps) => {
  const { lng } = useLanguage();

  const isTouchDevice = useGlobalStore((state) => state.isTouchDevice);

  const { isReceiverLanguage } = useTranslateSearchParam();

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
        {state === MESSAGE_STATE.SENT ? (
          <Spinner className="mb-2 size-5" />
        ) : null}
        <pre
          className={cn(
            'font-pretendard cursor-pointer whitespace-pre-wrap break-all transition-colors',
            'w-fit rounded-xl rounded-tr-none px-4 py-2',
            'bg-slate-100 duration-75 active:bg-slate-300',
            {
              'hover:bg-slate-200': !isTouchDevice,
            },
          )}
        >
          {isReceiverLanguage ? translatedMessage || message : message}
        </pre>
      </div>
    </article>
  );
};
