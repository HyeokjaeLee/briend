import type { FriendPeer } from '@/stores/peer';
import { cn } from '@/utils';

export interface ConnectionIndicatorProps {
  connection?: FriendPeer;
  className?: string;
}

enum CONNECTION_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline',
  EXPIRED = 'expired',
}

export const ConnectionIndicator = ({
  className,
  connection,
}: ConnectionIndicatorProps) => {
  let connectionStatus: CONNECTION_STATUS = CONNECTION_STATUS.EXPIRED;

  if (connection?.isExpired) {
    connectionStatus = CONNECTION_STATUS.EXPIRED;
  } else {
    connectionStatus = connection?.isConnected
      ? CONNECTION_STATUS.ONLINE
      : CONNECTION_STATUS.OFFLINE;
  }

  return (
    <div
      className={cn(
        'size-2 rounded-full flex-center',
        {
          [CONNECTION_STATUS.ONLINE]: 'bg-green-500',
          [CONNECTION_STATUS.OFFLINE]: 'bg-slate-400',
          [CONNECTION_STATUS.EXPIRED]: 'hidden',
        }[connectionStatus],
        className,
      )}
    />
  );
};
