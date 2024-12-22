import { CustomLink } from '@/components';
import { ROUTES } from '@/routes/client';
import {
  usePeerStore,
  MEDIA_QUERY_BREAK_POINT,
  useGlobalStore,
} from '@/stores';
import { cn } from '@/utils';
import { Avatar } from '@radix-ui/themes';

interface FriendCardProps {
  friendUserId: string;
  nickname: string;
  toSidePanel?: boolean;
}

enum CONNECTION_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline',
  EXPIRED = 'expired',
}

export const FriendCard = ({
  friendUserId,

  nickname,
}: FriendCardProps) => {
  const hasSidePanel = useGlobalStore(
    (state) => MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
  );

  const connection = usePeerStore((state) =>
    state.friendConnectionMap.get(friendUserId),
  );

  let connectionStatus: CONNECTION_STATUS = CONNECTION_STATUS.OFFLINE;

  if (connection?.isExpired) {
    connectionStatus = CONNECTION_STATUS.EXPIRED;
  } else {
    connectionStatus = connection?.isConnected
      ? CONNECTION_STATUS.ONLINE
      : CONNECTION_STATUS.OFFLINE;
  }

  return (
    <CustomLink
      className="block px-5 py-3"
      href={ROUTES.CHATTING_ROOM.pathname({
        userId: friendUserId,
      })}
      toSidePanel={hasSidePanel}
    >
      <article className="flex gap-3">
        <Avatar radius="full" size="5" />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{nickname}</strong>
            <p>마지막 메시지</p>
          </div>
          <div className="mb-auto">
            <div
              className={cn(
                'size-2 rounded-full flex-center',
                {
                  [CONNECTION_STATUS.ONLINE]: 'bg-green-500',
                  [CONNECTION_STATUS.OFFLINE]: 'bg-slate-400',
                  [CONNECTION_STATUS.EXPIRED]: 'hidden',
                }[connectionStatus],
              )}
            />
          </div>
        </div>
      </article>
    </CustomLink>
  );
};
