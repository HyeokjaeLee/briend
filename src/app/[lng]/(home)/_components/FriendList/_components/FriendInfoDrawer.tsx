'use client';

import { RiDeleteBinLine, RiShieldCheckFill } from 'react-icons/ri';

import { Avatar, Button, CustomLink, Drawer } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
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
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <Button asChild className="flex-2">
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
            </Button>
            <Button
              variant="outline"
              onlyIcon
              onClick={onClickDeleteFriendButton}
            >
              <RiDeleteBinLine />
            </Button>
          </div>
        </div>
      }
    >
      {friendInfo ? (
        <>
          <header className="flex flex-col items-center gap-2">
            <Avatar size={18} src={friendInfo.profileImage} />
            <div className="flex items-center gap-2">
              <h2
                className={cn('text-xl font-semibold', {
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
          {isUnlinked ? (
            <Button variant="ghost" className="mx-auto">
              연결 요청
            </Button>
          ) : null}
        </>
      ) : null}
    </Drawer>
  );
};
