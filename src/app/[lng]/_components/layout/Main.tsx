'use client';

import { motion, AnimatePresence, usePresence } from 'framer-motion';
import { shallow } from 'zustand/shallow';

import {
  useRef,
  type ReactElement,
  useState,
  useEffect,
  cloneElement,
} from 'react';

import { useHistoryStore } from '@/stores/history';

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction * 100 + '%',
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: direction * -100 + '%',
    };
  },
};

interface MainProps {
  children: ReactElement;
}

export const Main = ({ children }: MainProps) => {
  const [lastRouteType, historyIndex] = useHistoryStore(
    (state) => [state.lastRouteType, state.historyIndex],
    shallow,
  );

  const [prevChildren, setPrevChildren] = useState<ReactElement | null>(null);

  const newPageKey = `${lastRouteType ?? 'reload'}-${historyIndex}`;

  const [pageKey, setPageKey] = useState(newPageKey);

  useEffect(() => {
    setPageKey(newPageKey);
    if (!prevChildren.current) {
      prevChildren.current = cloneElement(children);
    }
  }, [children, newPageKey]);

  console.log(prevChildren.current, pageKey);

  return (
    <AnimatePresence
      initial={false}
      mode="popLayout"
      onExitComplete={() => {
        prevChildren.current = null;
        console.log('exit');
      }}
    >
      <motion.main
        key={pageKey}
        animate="animate"
        className="flex-1 overflow-auto"
        custom={lastRouteType === 'back' ? -1 : 1}
        exit="exit"
        initial="initial"
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        variants={variants}
      >
        {prevChildren.current || children}
        <div className="h-dvh" />
      </motion.main>
    </AnimatePresence>
  );
};
