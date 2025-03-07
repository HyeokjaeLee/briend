'use client';

import dayjs from 'dayjs';
import { RiLinkUnlinkM, RiShieldCheckFill } from 'react-icons/ri';

import { Avatar, Skeleton } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import type { RouterOutputs } from '@/configs/trpc/type';
import { chattingDB } from '@/database/indexed';
import { useIndexedDB, useLanguage } from '@/hooks';
import { cn, formatLocalizedDate } from '@/utils';

type FriendCardProps =
  RouterOutputs['friend']['getFriendList']['friendList'][number] & {
    onClick: () => void;
  };

export const FriendCard = ({
  id,
  name,
  profileImage,
  isAnonymous,
  isUnsubscribed,
  isLinked,
  onClick,
}: FriendCardProps) => {
  const { t } = useTranslation('friend-list');

  const lastMessage = useIndexedDB(chattingDB.messages, async (table) => {
    const messageList = await table
      .where('userId')
      .equals(id)
      .sortBy('timestamp');

    return messageList[messageList.length - 1];
  });

  const { lng } = useLanguage();

  const lastMessageDate = lastMessage ? dayjs(lastMessage.timestamp) : null;

  const isThisYear = lastMessageDate?.isSame(dayjs(), 'year');
  const isToday = lastMessageDate?.isSame(dayjs(), 'date');

  return (
    <button
      className="w-full cursor-pointer px-5 py-3"
      type="button"
      onClick={onClick}
    >
      <article className="flex items-center gap-3">
        <div className="relative">
          <Avatar size={18} src={profileImage} userId={id} />
          {isLinked ? null : (
            <div className="flex-center bg-background/50 absolute left-0 top-0 size-full">
              <RiLinkUnlinkM className="text-primary/50 size-8" />
            </div>
          )}
        </div>
        <div className="flex w-full max-w-full flex-col overflow-hidden">
          <header className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-1">
              <strong
                className={cn('text-start font-semibold', {
                  'font-medium text-slate-400': isUnsubscribed,
                })}
              >
                {isUnsubscribed ? t('unsubscribed-user') : name}
              </strong>
              <RiShieldCheckFill
                className={cn('size-4 text-green-500', {
                  hidden: isAnonymous,
                })}
              />
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              {lastMessageDate ? (
                <time className="text-xs">
                  {formatLocalizedDate(lastMessageDate, lng, {
                    day: !isToday,
                    time: isToday,
                    year: !isThisYear,
                  })}
                </time>
              ) : null}
            </div>
          </header>
          <div className="flex items-center justify-between">
            <p className="max-w-full overflow-hidden text-ellipsis text-nowrap text-start text-sm text-slate-500">
              {lastMessage?.message.replace(/\n/g, ' ') || '\u00A0'}
            </p>
          </div>
        </div>
      </article>
    </button>
  );
};

export const FriendCardSkeleton = () => (
  <div className="flex w-full gap-3 px-5 py-3">
    <Skeleton className="size-18 shrink-0 rounded-full" />
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-4.5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4.5 w-64" />
      </div>
    </div>
  </div>
);
