'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { FriendPeer } from '@/stores/peer';
import { cn } from '@/utils';
import { useEffect, useRef, useState } from 'react';

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
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (friendPeer) {
      firstRenderRef.current = false;
    }
  }, [friendPeer]);

  if (!friendPeer)
    return (
      <div
        className={cn(
          'size-2 rounded-full box-border border border-slate-300',
          className,
        )}
      />
    );

  const connectionStatus = friendPeer.isExpired
    ? CONNECTION_STATUS.EXPIRED
    : friendPeer.isConnected
      ? CONNECTION_STATUS.ONLINE
      : CONNECTION_STATUS.OFFLINE;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connectionStatus}
        animate={firstRenderRef.current ? false : { scale: [1, 2, 1] }}
        className={cn(
          'size-2 rounded-full',
          {
            [CONNECTION_STATUS.ONLINE]: 'bg-green-500',
            [CONNECTION_STATUS.OFFLINE]: 'bg-red-500',
            [CONNECTION_STATUS.EXPIRED]: 'bg-gray-500',
          }[connectionStatus],
          className,
        )}
        initial={false}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      />
    </AnimatePresence>
  );
};
