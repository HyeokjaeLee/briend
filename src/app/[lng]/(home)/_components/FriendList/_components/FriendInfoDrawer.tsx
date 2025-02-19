'use client';

import { RiDeleteBinLine, RiShieldCheckFill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import {
  CustomButton,
  CustomIconButton,
  CustomLink,
  Drawer,
  ProfileImage,
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

  return (
    <Drawer
      className="h-80 flex-col gap-4 flex-center"
      open={!!friendId}
      onClose={onClose}
    >
      {friendInfo ? (
        <>
          <header className="flex flex-col items-center gap-2">
            <ProfileImage size="7" src={friendInfo.profileImage} />
            <div className="flex items-center gap-2">
              <h2
                className={cn('font-semibold text-lg', {
                  'text-slate-400 font-medium': friendInfo.isUnsubscribed,
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
          {/** TODO: 마지막 채팅 업데이트 기준으로 만료시키기
           * <Timer expires={expires} /> */}
          <footer className="mt-auto flex w-full gap-2">
            <CustomButton asChild className="flex-1">
              <CustomLink
                href={ROUTES.CHATTING_ROOM.pathname({
                  userId: friendId!,
                })}
                toSidePanel={hasSidePanel}
                onClick={onClose}
              >
                {t('chatting-button')}
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
