'use client';

import { useShallow } from 'zustand/shallow';

import { memo } from 'react';

import { useUserData } from '@/hooks';
import { useFriendStore } from '@/stores';
import { Skeleton } from '@radix-ui/themes';

import { FriendCard } from './_components/FriendCard';
import { FriendInfoDrawer } from './_components/FriendInfoDrawer';
import { GuestBanner } from './_components/GuestBanner';
import { MyProfileCard } from './_components/MyProfileCard';

const USER_DRAWER_PARAM = 'user-id';

const ChattingListPage = () => {
  const [friendList] = useFriendStore(
    useShallow((state) => [state.friendList]),
  );

  const { isLogin, isLoading, user } = useUserData();

  return (
    <article>
      <ul>
        <li className="border-b border-b-slate-100">
          {isLogin ? (
            <MyProfileCard userName={user.name} />
          ) : isLoading ? (
            <div className="flex h-28 items-center gap-4 px-5">
              <Skeleton className="size-20" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-5 w-44" />
              </div>
            </div>
          ) : (
            <GuestBanner />
          )}
        </li>
        {friendList.map(({ userId, nickname }) => (
          <li key={userId}>
            <FriendCard
              friendUserId={userId}
              href={`?${USER_DRAWER_PARAM}=${userId}`}
              nickname={nickname}
            />
          </li>
        ))}
      </ul>
      <FriendInfoDrawer />
    </article>
  );
};

export default memo(ChattingListPage);
