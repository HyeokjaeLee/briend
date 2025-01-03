'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { FriendPeer } from '@/stores/peer';
import { cn } from '@/utils';

export interface ConnectionIndicatorProps {
  friendPeer?: FriendPeer;
  className?: string;
}

enum CONNECTION_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline',
  EXPIRED = 'expired',
}

export const ConnectionIndicator = ({
  className,
  friendPeer,
}: ConnectionIndicatorProps) => {
  let connectionStatus: CONNECTION_STATUS = CONNECTION_STATUS.EXPIRED;

  if (friendPeer?.isExpired) {
    connectionStatus = CONNECTION_STATUS.EXPIRED;
  } else {
    connectionStatus = friendPeer?.isConnected
      ? CONNECTION_STATUS.ONLINE
      : CONNECTION_STATUS.OFFLINE;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connectionStatus}
        animate={{ scale: [1, 2, 1] }}
        className={cn(
          'size-2 rounded-full flex-center',
          {
            [CONNECTION_STATUS.ONLINE]: 'bg-green-500',
            [CONNECTION_STATUS.OFFLINE]: 'bg-red-500',
            [CONNECTION_STATUS.EXPIRED]: 'bg-gray-500',
          }[connectionStatus],
          className,
        )}
        initial={{ scale: 1 }}
        transition={{
          duration: 0.3,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        }}
      />
    </AnimatePresence>
  );
};
