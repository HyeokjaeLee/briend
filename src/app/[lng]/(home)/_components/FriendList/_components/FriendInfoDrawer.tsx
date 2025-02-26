'use client';

import { RiDeleteBinLine, RiLinkM, RiShieldCheckFill } from 'react-icons/ri';

import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import {
  CustomButton,
  CustomIconButton,
  CustomLink,
  Drawer,
  ProfileImage,
  Timer,
} from '@/components';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

interface FriendInfoDrawerProps {
  onClickDeleteFriendButton?: () => void;
  friendId: string | null;
  onClose: () => void;
}

export const DRAWER_SEARCH_PARAM = 'user-id';

export const FriendInfoDrawer = ({
  onClickDeleteFriendButton,
  friendId,
  onClose,
}: FriendInfoDrawerProps) => {
  const [{ friendList }] = trpc.friend.list.useSuspenseQuery();

  const { t } = useTranslation('friend-list');

  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

  const friendInfo = friendList.find((friend) => friend.id === friendId);

  const isUnlinked = !friendInfo?.isLinked;

  return (
    <Drawer
      className="flex-center flex-col gap-4"
      open={!!friendId}
      onClose={onClose}
    >
      {friendInfo ? (
        <>
          <header className="flex flex-col items-center gap-2">
            <ProfileImage size="7" src={friendInfo.profileImage} />
            <div className="flex items-center gap-2">
              <h2
                className={cn('text-lg font-semibold', {
                  'font-medium text-slate-400': friendInfo.isUnsubscribed,
                })}
              >
                {friendInfo.isUnsubscribed
                  ? t('unsubscribed-user')
                  : friendInfo.name}
              </h2>
              <RiShieldCheckFill
                className={cn('size-5 text-green-500', {
                  hidden: friendInfo.isAnonymous,
                })}
              />
            </div>
          </header>
          <Timer expires={new Date('2025-05-01')} />
          <footer className="mt-auto flex w-full gap-2">
            {isUnlinked ? (
              <CustomIconButton variant="outline">
                <RiLinkM className="size-6" />
              </CustomIconButton>
            ) : null}
            <CustomButton asChild className="flex-1">
              <CustomLink
                href={ROUTES.CHATTING_ROOM.pathname({
                  userId: friendId!,
                })}
                toSidePanel={hasSidePanel}
                onClick={onClose}
              >
                {isUnlinked
                  ? t('unlinked-chatting-button')
                  : t('chatting-button')}
              </CustomLink>
            </CustomButton>
            <CustomIconButton
              variant="outline"
              onClick={onClickDeleteFriendButton}
            >
              <RiDeleteBinLine className="size-6" />
            </CustomIconButton>
          </footer>
        </>
      ) : null}
    </Drawer>
  );
};
