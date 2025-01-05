import { useSearchParams } from 'next/navigation';

import { RiDeleteBinLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import {
  CustomButton,
  CustomIconButton,
  CustomLink,
  Drawer,
  ProfileImage,
  Timer,
} from '@/components';
import { useCheckIndividualPeer, useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import {
  MEDIA_QUERY_BREAK_POINT,
  useFriendStore,
  useGlobalStore,
} from '@/stores';
import { expToDate, getConnectionStatus } from '@/utils';
import { CONNECTION_STATUS } from '@/utils/getConnectionStatus';
import { Badge, Skeleton } from '@radix-ui/themes';

export const DRAWER_SEARCH_PARAM = 'user-id';

export const FriendInfoDrawer = () => {
  const searchParams = useSearchParams();

  const userId = searchParams.get(DRAWER_SEARCH_PARAM);

  const router = useCustomRouter();

  const friendInfo = useFriendStore((state) =>
    state.friendList.find((friend) => friend.userId === userId),
  );

  const { friendPeer } = useCheckIndividualPeer(userId);

  const connectionStatus = getConnectionStatus(friendPeer);

  const { t } = useTranslation('friend-list');

  const expires = expToDate(friendPeer?.exp);

  const hasSidePanel = useGlobalStore(
    (state) => MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
  );

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete(DRAWER_SEARCH_PARAM);

    router.replace(url.href);
  };

  return (
    <Drawer
      className="h-80 flex-col gap-4 flex-center"
      open={!!userId}
      onClose={handleClose}
    >
      <header className="flex flex-col items-center gap-2">
        <ProfileImage size="7" />
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{friendInfo?.nickname}</h2>
          <Skeleton loading={connectionStatus === CONNECTION_STATUS.LOADING}>
            <Badge
              color={
                connectionStatus === CONNECTION_STATUS.ONLINE ? 'green' : 'gray'
              }
            >
              {
                {
                  [CONNECTION_STATUS.LOADING]: t('expired-badge'),
                  [CONNECTION_STATUS.EXPIRED]: t('expired-badge'),
                  [CONNECTION_STATUS.ONLINE]: t('online-badge'),
                  [CONNECTION_STATUS.OFFLINE]: t('offline-badge'),
                }[connectionStatus]
              }
            </Badge>
          </Skeleton>
        </div>
      </header>
      <Timer expires={expires} />
      <footer className="mt-auto flex w-full gap-2">
        <CustomButton asChild className="flex-1">
          <CustomLink
            href={ROUTES.CHATTING_ROOM.pathname({
              userId: userId!,
            })}
            toSidePanel={hasSidePanel}
            onClick={() => {
              if (hasSidePanel) {
                handleClose();
              }
            }}
          >
            {t('chatting-button')}
          </CustomLink>
        </CustomButton>
        <CustomIconButton variant="outline">
          <RiDeleteBinLine />
        </CustomIconButton>
      </footer>
    </Drawer>
  );
};
