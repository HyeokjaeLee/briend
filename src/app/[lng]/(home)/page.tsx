'use client';

import { memo, useState } from 'react';

import { useUserData } from '@/hooks';
import { Skeleton } from '@radix-ui/themes';

import { FriendDeleteModal } from './_components/FriendDeleteModal';
import { FriendInfoDrawer } from './_components/FriendInfoDrawer';
import { FrinedListItems } from './_components/FrinedListItems';
import { GuestBanner } from './_components/GuestBanner';
import { MyProfileCard } from './_components/MyProfileCard';

const ChattingListPage = () => {
  const { isLogin, isLoading, user } = useUserData();
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

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
        <FrinedListItems />
      </ul>
      <FriendInfoDrawer
        onClickDeleteFriendButton={() => setIsDeleteModalOpened(true)}
      />
      <FriendDeleteModal
        opened={isDeleteModalOpened}
        onClose={() => setIsDeleteModalOpened(false)}
      />
    </article>
  );
};

export default memo(ChattingListPage);
