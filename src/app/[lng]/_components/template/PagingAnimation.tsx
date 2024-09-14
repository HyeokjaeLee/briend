'use client';

import { motion, AnimatePresence } from 'framer-motion';

import type { PropsWithChildren } from 'react';

import { useHistoryStore } from '@/stores/history';

export const PagingAnimation = ({ children }: PropsWithChildren) => {
  const lastRouteType = useHistoryStore((state) => state.lastRouteType);

  return (
    <AnimatePresence initial={!!lastRouteType}>
      <motion.main
        animate="enter"
        exit="exit"
        initial="hidden"
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        variants={{
          hidden: {
            opacity: 0,
            x: lastRouteType === 'back' ? '-100%' : '100%',
          },
          enter: { opacity: 1, x: 0 },
          exit: {
            opacity: 0,
            x: lastRouteType === 'back' ? '100%' : '-100%',
          },
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};
