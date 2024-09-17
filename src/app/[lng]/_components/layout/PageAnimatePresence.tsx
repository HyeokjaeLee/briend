'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { ReactNode } from 'react';

import { useHistoryStore } from '@/stores/history';

import { FrozenRoute } from './FrozenRoute';

interface PageAnimatePresence {
  children: ReactNode;
  className?: string;
}

export const PageAnimatePresence = ({
  children,
  className,
}: PageAnimatePresence) => {
  const key = useHistoryStore(({ historyIndex, historyId, lastRouteType }) =>
    historyId && lastRouteType
      ? `${historyId}.${historyIndex}.${lastRouteType}`
      : null,
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} className={className}>
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
};
