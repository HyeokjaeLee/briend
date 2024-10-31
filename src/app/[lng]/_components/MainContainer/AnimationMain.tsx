'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';

import { useLayoutEffect, useState, type PropsWithChildren } from 'react';

import {
  SESSION_STORAGE,
  type SESSION_STORAGE_TYPE,
} from '@/constants/storage-key';
import { useUrl } from '@/hooks/useUrl';
import { useHistoryStore } from '@/stores/history';

const transitionX = {
  duration: 0.05,
  ease: 'easeIn',
};

const transitionY = {
  duration: 0.1,
  ease: 'easeIn',
};

const ANIMATION_GROUP: Record<
  SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION,
  HTMLMotionProps<'main'>
> = {
  FROM_LEFT: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: transitionX,
  },
  FROM_RIGHT: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: transitionX,
  },
  FROM_TOP: {
    initial: { y: '-50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '50vh', opacity: 0 },
    transition: transitionY,
  },
  FROM_BOTTOM: {
    initial: { y: '50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-50vh', opacity: 0 },
    transition: transitionY,
  },
  NONE: {},
};

export const AnimationMain = ({ children }: PropsWithChildren) => {
  const url = useUrl();

  const [key, setKey] = useState(url);
  const [animation, setAnimation] =
    useState<SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION>();

  useLayoutEffect(() => {
    if (animation) return;

    const { historyIndex: prevHistoryIndex } = useHistoryStore.getState();

    if (prevHistoryIndex === -1) return;

    const reservedNavigationAnimation = sessionStorage.getItem(
      SESSION_STORAGE.NAVIGATION_ANIMATION,
    ) as SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION | null;

    if (reservedNavigationAnimation) {
      sessionStorage.removeItem(SESSION_STORAGE.NAVIGATION_ANIMATION);

      return setAnimation(reservedNavigationAnimation);
    }

    const historyIndex: number | undefined = history.state.historyIndex;

    if (typeof historyIndex === 'number') {
      if (historyIndex < prevHistoryIndex) return setAnimation('FROM_TOP');

      if (historyIndex > prevHistoryIndex) return setAnimation('FROM_BOTTOM');
    }

    setAnimation('FROM_BOTTOM');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useLayoutEffect(() => {
    if (!animation) return;

    setKey(url);
  }, [url, animation]);

  const animationProps = ANIMATION_GROUP[animation ?? 'NONE'];

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.main
        {...animationProps}
        key={key}
        /* @ts-expect-error - 🚧 임시로 해결 추후 @types/react 버전 업데이트 시 삭제 */
        className="flex flex-1 flex-col overflow-auto"
        onAnimationComplete={(e: { opacity: number }) => {
          if (e.opacity === 1) {
            setAnimation(undefined);
          }
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};
