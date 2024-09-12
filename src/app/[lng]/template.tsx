'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useDeviceStore } from '@/stores/device';

import { useHistoryMount } from './_hooks/useHistoryMount';

export default function Template({ children }: { children: React.ReactNode }) {
  const { lastRouteType } = useHistoryMount();

  console.log(lastRouteType);

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
          exit: { opacity: 0, x: lastRouteType === 'back' ? '100%' : '-100%' },
        }}
      >
        {children}
        <div className="h-dvh" />
      </motion.main>
    </AnimatePresence>
  );
}
