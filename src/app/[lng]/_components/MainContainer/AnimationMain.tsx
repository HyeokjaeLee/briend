'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/shallow';

import { useEffect, useRef, type PropsWithChildren } from 'react';

import { NAVIGATION_ANIMATION } from '@/constants/etc';
import { useUrl } from '@/hooks/useUrl';
import { useGlobalStore } from '@/stores/global';
import { useHistoryStore } from '@/stores/history';

const ANIMATION_GROUP: Record<NAVIGATION_ANIMATION, HTMLMotionProps<'main'>> = {
  [NAVIGATION_ANIMATION.FROM_LEFT]: {
    initial: { x: -300, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
    transition: { duration: 0.075 },
  },
  [NAVIGATION_ANIMATION.FROM_RIGHT]: {
    initial: { x: 300, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.075 },
  },
  [NAVIGATION_ANIMATION.FROM_TOP]: {
    initial: { y: -500, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 500, opacity: 0 },
    transition: { duration: 0.1 },
  },
  [NAVIGATION_ANIMATION.FROM_BOTTOM]: {
    initial: { y: 500, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -500, opacity: 0 },
    transition: { duration: 0.1 },
  },
  [NAVIGATION_ANIMATION.NONE]: {},
};

export const AnimationMain = ({ children }: PropsWithChildren) => {
  const url = useUrl();

  const historyIndex = useHistoryStore((state) => state.historyIndex);
  const prevHistoryIndex = useRef(historyIndex);

  const [navigationAnimation] = useGlobalStore(
    useShallow((state) => {
      return [state.navigationAnimation];
    }),
  );

  useEffect(
    () => () => {
      prevHistoryIndex.current = historyIndex;
    },
    [historyIndex],
  );

  const animation = navigationAnimation
    ? ANIMATION_GROUP[navigationAnimation]
    : {};

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.main
        {...animation}
        key={url}
        /* @ts-expect-error - 🚧 임시로 해결 추후 @types/react 버전 업데이트 시 삭제 */
        className="flex flex-1 flex-col overflow-auto"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};
