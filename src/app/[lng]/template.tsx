'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { Suspense } from 'react';

import { useHistoryStore } from '@/stores/history';

import { HistoryObserver } from './_components/template/HistoryObserver';

export default function Template({ children }: { children: React.ReactNode }) {
  const lastRouteType = useHistoryStore((state) => state.lastRouteType);

  return (
    <>
      <Suspense>
        <HistoryObserver />
      </Suspense>
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
          <div className="h-dvh" />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
