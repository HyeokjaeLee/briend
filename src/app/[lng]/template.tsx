'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { shallow } from 'zustand/shallow';

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
    let navigateType: NavigateType;

    const currentHistoryLength = history.length;

    const lastHistoryLength = (() => {
      const lastHistoryLengthSession = sessionStorage.getItem(
        SESSION.HISTORY_LENGTH,
      );

      sessionStorage.setItem(
        SESSION.HISTORY_LENGTH,
        String(currentHistoryLength),
      );

      return lastHistoryLengthSession ? Number(lastHistoryLengthSession) : null;
    })();

    const lastHistoryIndex = (() => {
      const lastHistoryIndexSession = sessionStorage.getItem(
        SESSION.HISTORY_INDEX,
      );

      return lastHistoryIndexSession ? Number(lastHistoryIndexSession) : null;
    })();

    const lastHistorySession = sessionStorage.getItem(SESSION.HISTORY);

    const currentUrl = `${location.pathname}?${search}`;

    let currentHistoryIndex = 0;
    const setHistoryIndex = (index: number) => {
      history.replaceState({ ...history.state, index }, '');

      sessionStorage.setItem(SESSION.HISTORY_INDEX, String(index));

      currentHistoryIndex = index;
    };

    if (
      lastHistoryLength === null ||
      lastHistoryIndex === null ||
      !lastHistorySession
    ) {
      console.info('init history');

      return setCustomHistory((prev) => {
        prev.set(history.length, currentUrl);

        setHistoryIndex(0);

        sessionStorage.setItem(
          SESSION.HISTORY,
          JSON.stringify(Array.from(prev.entries())),
        );
      });
    }

    const hasHistoryIndex = 'index' in history.state;

    if (hasHistoryIndex) {
      const index: number = history.state.index;

      navigateType = index < lastHistoryIndex ? 'back' : 'forward';

      console.info(navigateType);

      //* 히스토리 인덱스 세션 저장
      sessionStorage.setItem(SESSION.HISTORY_INDEX, String(index));
    } else {
      const replacedHistoryIndexSession = sessionStorage.getItem(
        SESSION.REPLACED_HISTORY_INDEX,
      );

      if (replacedHistoryIndexSession) {
        sessionStorage.removeItem(SESSION.REPLACED_HISTORY_INDEX);

        navigateType = 'replace';

        setHistoryIndex(Number(replacedHistoryIndexSession));
      } else {
        navigateType = 'push';

        setHistoryIndex(lastHistoryIndex + 1);
      }

      console.info(navigateType);

      setCustomHistory((prev) => {
        //* 이전 세션 복구
        if (!prev.size && lastHistoryIndex) {
          if (lastHistorySession) {
            console.info('refresh');

            const lastHistory: [number, string][] =
              JSON.parse(lastHistorySession);
            lastHistory.forEach(([index, url]) => {
              prev.set(index, url);
            });
          }
        }

        prev.set(currentHistoryIndex, currentUrl);

        sessionStorage.setItem(
          SESSION.HISTORY,
          JSON.stringify(Array.from(prev.entries())),
        );
      });
    }
  }, [search, setCustomHistory]);

  return (
    <AnimatePresence initial={!isEnter} mode="wait">
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
