'use client';

import type { HTMLMotionProps } from 'motion/react';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';

import { memo, useLayoutEffect, useState, type PropsWithChildren } from 'react';

import {
  SESSION_STORAGE,
  SELECTOR,
  type SESSION_STORAGE_TYPE,
} from '@/constants';
import { useHistoryStore } from '@/stores';

const transitionIn = {
  duration: 0.15,
  ease: 'linear',
};

const transitionOut = {
  duration: 0.075,
  ease: 'linear',
};

const ANIMATION_GROUP: Record<
  SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION,
  HTMLMotionProps<'main'>
> = {
  FROM_LEFT: {
    initial: { x: -200, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: transitionIn },
    exit: { x: 200, opacity: 0, transition: transitionOut },
  },
  FROM_RIGHT: {
    initial: { x: 200, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: transitionIn },
    exit: { x: -200, opacity: 0, transition: transitionOut },
  },
  FROM_TOP: {
    initial: { y: '-50dvh', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: transitionIn },
    exit: { y: '50dvh', opacity: 0, transition: transitionOut },
  },
  FROM_BOTTOM: {
    initial: { y: '50dvh', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: transitionIn },
    exit: { y: '-50dvh', opacity: 0, transition: transitionOut },
  },
  NONE: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0 },
  },
};

export const AnimationMain = memo(({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const [key, setKey] = useState(pathname);
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
  }, [pathname]);

  useLayoutEffect(() => {
    if (!animation) return;

    setKey(pathname);
  }, [pathname, animation]);

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
});

AnimationMain.displayName = 'AnimationMain';
