'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';

import { useLayoutEffect, useState, type PropsWithChildren } from 'react';

import { SELECTOR } from '@/constants/selector';
import {
  SESSION_STORAGE,
  type SESSION_STORAGE_TYPE,
} from '@/constants/storage-key';
import { useUrl } from '@/hooks/useUrl';
import { useHistoryStore } from '@/stores/history';

const transitionX = {
  duration: 0.05,
  ease: 'linear',
};

const transitionY = {
  duration: 0.05,
  ease: 'linear',
};

const ANIMATION_GROUP: Record<
  SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION,
  HTMLMotionProps<'main'>
> = {
  FROM_LEFT: {
    initial: { x: -200, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 200, opacity: 0 },
    transition: transitionX,
  },
  FROM_RIGHT: {
    initial: { x: 200, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -200, opacity: 0 },
    transition: transitionX,
  },
  FROM_TOP: {
    initial: { y: '-50dvh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '50dvh', opacity: 0 },
    transition: transitionY,
  },
  FROM_BOTTOM: {
    initial: { y: '50dvh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-50dvh', opacity: 0 },
    transition: transitionY,
  },
  NONE: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0 },
  },
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

      if (historyIndex === prevHistoryIndex) return setAnimation(undefined);
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
        className="flex size-full flex-col overflow-auto"
        id={SELECTOR.MAIN}
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
