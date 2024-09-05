'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { shallow, useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { SESSION } from '@/constants/storage-key';
import { useDeviceStore } from '@/stores/device';

const variants = {
  hidden: { opacity: 0, x: '100%' },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '-100%' },
};

type NavigateType = 'back' | 'forward' | 'push' | 'replace';

export default function Template({ children }: { children: React.ReactNode }) {
  const search = useSearchParams().toString();
  const [customHistory, setCustomHistory] = useDeviceStore(
    (state) => [state.customHistory, state.setCustomHistory],
    shallow,
  );

  const isEnter = !customHistory.size;

  useEffect(() => {
    let navigateType: NavigateType = 'push';

    const lastHistoryLengthSession = sessionStorage.getItem(
        SESSION.HISTORY_LENGTH,
      ),
      lastHistoryLength = lastHistoryLengthSession
        ? Number(lastHistoryLengthSession)
        : null;

    const lastHistoryIndexSession = sessionStorage.getItem(
        SESSION.HISTORY_INDEX,
      ),
      lastHistoryIndex = lastHistoryIndexSession
        ? Number(lastHistoryIndexSession)
        : null;

    const lasHistorySession = sessionStorage.getItem(SESSION.HISTORY);

    const currentUrl = `${location.pathname}?${search}`;

    if (!lastHistoryLength || !lastHistoryIndex || !lasHistorySession) {
      return setCustomHistory((prev) => {
        prev.set(history.length, currentUrl);

        sessionStorage.setItem(SESSION.HISTORY_LENGTH, String(history.length));

        const index = history.length - 1;

        history.replaceState({ ...history.state, index }, '');

        sessionStorage.setItem(SESSION.HISTORY_INDEX, String(index));
        sessionStorage.setItem(
          SESSION.HISTORY,
          JSON.stringify(Array.from(prev.entries())),
        );
      });
    }

    const hasHistoryIndex = 'index' in history.state;

    if (hasHistoryIndex) {
      //! back, forward
      const index: number = history.state.index;

      navigateType = index < lastHistoryIndex ? 'back' : 'forward';

      //* 히스토리 인덱스 세션 저장
      sessionStorage.setItem(SESSION.HISTORY_INDEX, String(index));
    } else {
      //! replace, push
      if (lastHistoryIndex <= history.length - 1) {
      }
      setCustomHistory((prev) => {
        //* 이전 세션 복구
        if (!prev.size && lastHistoryIndex) {
          if (lasHistorySession) {
            const lastHistory: [number, string][] =
              JSON.parse(lasHistorySession);
            lastHistory.forEach(([index, url]) => {
              prev.set(index, url);
            });
          }
        }
      });

      history.replaceState({ ...history.state, index: history.length - 1 }, '');
    }
  }, [search, setCustomHistory]);

  return (
    <AnimatePresence initial={isEnter} mode="wait">
      <motion.main
        animate="enter"
        exit="exit"
        initial="hidden"
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        variants={variants}
      >
        {children}
        <div className="h-dvh" />
      </motion.main>
    </AnimatePresence>
  );
}
