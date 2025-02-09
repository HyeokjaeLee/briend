'use client';

import { useState } from 'react';

import { trpc } from '@/app/trpc';
import { createSuspensedComponent } from '@/utils/client';

import { FriendCard, FriendCardSkeleton } from './_components/FriendCard';
import { FriendDeleteModal } from './_components/FriendDeleteModal';
import {
  DRAWER_SEARCH_PARAM,
  FriendInfoDrawer,
} from './_components/FriendInfoDrawer';

export const FriendList = createSuspensedComponent(
  () => {
    const [{ friendList }] = trpc.friend.getFriendList.useSuspenseQuery();

    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

    return (
      <ul>
        {friendList.map(({ id, name = '' }) => (
          <li key={id}>
            <FriendCard
              href={`?${DRAWER_SEARCH_PARAM}=${id}`}
              id={id}
              name={name}
            />
          </li>
        ))}
        <FriendInfoDrawer
          onClickDeleteFriendButton={() => setIsDeleteModalOpened(true)}
        />
        <FriendDeleteModal
          opened={isDeleteModalOpened}
          onClose={() => setIsDeleteModalOpened(false)}
        />
      </ul>
    );
  },
  () => {
    const EMPTY_FRIEND_LIST = new Array(20).fill(null);

    return (
      <div>
        {EMPTY_FRIEND_LIST.map((_, index) => (
          <FriendCardSkeleton key={index} />
        ))}
      </div>
    );
  },
);
