'use client';

import { useShallow } from 'zustand/shallow';

import { useUserData } from '@/hooks';
import { useFriendStore, usePeerStore } from '@/stores';
import { Skeleton } from '@radix-ui/themes';

import { FriendCard } from './_components/FriendCard';
import { GuestCard } from './_components/GuestCard';
import { MyProfileCard } from './_components/MyProfileCard';

const ChattingListPage = () => {
  const [friendList] = useFriendStore(
    useShallow((state) => [state.friendList]),
  );

  const friendConnectionMap = usePeerStore(
    (state) => state.friendConnectionMap,
  );

  const { isLogin, isLoading, user } = useUserData();

  return (
    <article>
      <ul>
        <li className="border-b border-b-slate-100">
          {isLogin ? (
            <MyProfileCard userId={user.id} userName={user.name} />
          ) : isLoading ? (
            <div className="flex h-28 items-center gap-4 px-5">
              <Skeleton className="size-20" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-5 w-44" />
              </div>
            </div>
          ) : (
            <GuestCard />
          )}
        </li>
        {friendList.map(({ userId, nickname }) => (
          <li key={userId}>
            <FriendCard friendUserId={userId} nickname={nickname} />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ChattingListPage;
