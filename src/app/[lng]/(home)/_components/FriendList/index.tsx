'use client';

import { useState } from 'react';

import { trpc } from '@/app/trpc';
import { createSuspensedComponent } from '@/utils/client';

import { FriendCard, FriendCardSkeleton } from './_components/FriendCard';
import { FriendDeleteModal } from './_components/FriendDeleteModal';
import { FriendInfoDrawer } from './_components/FriendInfoDrawer';

export const FriendList = createSuspensedComponent(
  () => {
    const [{ friendList }] = trpc.friend.getFriendList.useSuspenseQuery();

    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [openedFriendId, setOpenedFriendId] = useState<string | null>(null);

    const handleClose = () => {
      setOpenedFriendId(null);
      setIsDeleteModalOpened(false);
    };

    return (
      <ul>
        {friendList.map(({ id, ...restInfo }) => (
          <li key={id}>
            <FriendCard {...restInfo} onClick={() => setOpenedFriendId(id)} />
          </li>
        ))}
        <FriendInfoDrawer
          friendId={openedFriendId}
          onClickDeleteFriendButton={() => setIsDeleteModalOpened(true)}
          onClose={handleClose}
        />
        <FriendDeleteModal
          opened={isDeleteModalOpened}
          onClose={() => setIsDeleteModalOpened(false)}
        />
      </ul>
    );
  },
  {
    fallback: () => {
      const EMPTY_FRIEND_LIST = new Array(20).fill(null);

      return (
        <div>
          {EMPTY_FRIEND_LIST.map((_, index) => (
            <FriendCardSkeleton key={index} />
          ))}
        </div>
      );
    },
    ssrFallback: true,
  },
);
