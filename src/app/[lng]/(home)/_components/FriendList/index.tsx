'use client';

import { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { CustomButton, CustomLink, DotLottie } from '@/components';
import { useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { createSuspendedComponent } from '@/utils/client';

import { FriendCard, FriendCardSkeleton } from './_components/FriendCard';
import { FriendDeleteModal } from './_components/FriendDeleteModal';
import { FriendInfoDrawer } from './_components/FriendInfoDrawer';

export const FriendList = createSuspendedComponent(
  () => {
    const [{ friendList }] = trpc.friend.list.useSuspenseQuery();

    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [openedFriendId, setOpenedFriendId] = useState<string | null>(null);

    const handleClose = () => {
      setOpenedFriendId(null);
      setIsDeleteModalOpened(false);
    };

    const { isLogin } = useUserData();

    const { t } = useTranslation('friend-list');

    if (!friendList.length)
      return (
        <section className="flex-center flex-1 flex-col gap-2">
          <DotLottie className="size-36" src="/assets/lottie/empty.lottie" />
          <h3 className="text-lg font-semibold text-zinc-500">
            {t('empty-friend-list')}
          </h3>
          {isLogin ? (
            <CustomButton asChild>
              <CustomLink
                replace
                href={ROUTES.INVITE_CHAT.pathname}
                withAnimation="FROM_LEFT"
              >
                {t('add-friend-button')}
              </CustomLink>
            </CustomButton>
          ) : null}
        </section>
      );

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
          friendId={openedFriendId}
          opened={isDeleteModalOpened}
          onClose={() => setIsDeleteModalOpened(false)}
          onSuccess={handleClose}
        />
      </ul>
    );
  },
  {
    fallback: () => {
      const EMPTY_FRIEND_LIST = new Array(20).fill(null);

      return (
        <div className="flex-1 overflow-hidden">
          {EMPTY_FRIEND_LIST.map((_, index) => (
            <FriendCardSkeleton key={index} />
          ))}
        </div>
      );
    },
    ssrFallback: true,
  },
);
