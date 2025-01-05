import type { FriendPeer } from '@/stores/peer';

export enum CONNECTION_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline',
  EXPIRED = 'expired',
  LOADING = 'loading',
}

export const getConnectionStatus = (friendPeer?: FriendPeer | null) => {
  if (!friendPeer) return CONNECTION_STATUS.LOADING;

  if (friendPeer.isExpired) return CONNECTION_STATUS.EXPIRED;

  return friendPeer.isConnected
    ? CONNECTION_STATUS.ONLINE
    : CONNECTION_STATUS.OFFLINE;
};
