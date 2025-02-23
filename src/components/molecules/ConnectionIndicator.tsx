'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import type { FriendPeer } from '@/stores/peer';
import { cn, getConnectionStatus } from '@/utils';
import { CONNECTION_STATUS } from '@/utils/getConnectionStatus';

export interface ConnectionIndicatorProps {
  friendPeer?: FriendPeer;
  className?: string;
}

export const ConnectionIndicator = ({
  className,
  friendPeer,
}: ConnectionIndicatorProps) => {
  const firstRenderRef = useRef(true);

  const connectionStatus = getConnectionStatus(friendPeer);

  const isLoading = connectionStatus === CONNECTION_STATUS.LOADING;

  useEffect(() => {
    if (!isLoading) {
      firstRenderRef.current = false;
    }
  }, [isLoading]);

  if (isLoading)
    return (
      <div
        className={cn(
          'size-2 rounded-full box-border border border-slate-300 shrink-0',
          className,
        )}
      />
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connectionStatus}
        animate={firstRenderRef.current ? false : { scale: [1, 2, 1] }}
        className={cn(
          'size-2 rounded-full shrink-0',
          {
            [CONNECTION_STATUS.ONLINE]: 'bg-green-500',
            [CONNECTION_STATUS.OFFLINE]: 'bg-red-500',
            [CONNECTION_STATUS.EXPIRED]: 'bg-zinc-500',
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
