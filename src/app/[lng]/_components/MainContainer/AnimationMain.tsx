'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/shallow';

import { useRef, type PropsWithChildren } from 'react';

import { NAVIGATION_ANIMATION } from '@/constants/etc';
import { useUrl } from '@/hooks/useUrl';
import { useGlobalStore } from '@/stores/global';
import { useHistoryStore } from '@/stores/history';

const transitionX = {
  duration: 0.05,
  ease: 'easeIn',
};

const transitionY = {
  duration: 0.075,
  ease: 'easeIn',
};

const ANIMATION_GROUP: Record<NAVIGATION_ANIMATION, HTMLMotionProps<'main'>> = {
  [NAVIGATION_ANIMATION.FROM_LEFT]: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: transitionX,
  },
  [NAVIGATION_ANIMATION.FROM_RIGHT]: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: transitionX,
  },
  [NAVIGATION_ANIMATION.FROM_TOP]: {
    initial: { y: '-50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '50vh', opacity: 0 },
    transition: transitionY,
  },
  [NAVIGATION_ANIMATION.FROM_BOTTOM]: {
    initial: { y: '50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-50vh', opacity: 0 },
    transition: transitionY,
  },
  [NAVIGATION_ANIMATION.FROM_TOP_AUTO]: {
    initial: { y: '-50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-50vh', opacity: 0 },
    transition: transitionY,
  },
  [NAVIGATION_ANIMATION.FROM_BOTTOM_AUTO]: {
    initial: { y: '50vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '50vh', opacity: 0 },
    transition: transitionY,
  },
  [NAVIGATION_ANIMATION.NONE]: {},
};

export const AnimationMain = ({ children }: PropsWithChildren) => {
  const url = useUrl();

  const [navigationAnimation, setNavigationAnimation] = useGlobalStore(
    useShallow((state) => {
      return [state.navigationAnimation, state.setNavigationAnimation];
    }),
  );

  const animationKey = (() => {
    if (typeof window === 'undefined') return navigationAnimation;

    if (navigationAnimation !== NAVIGATION_ANIMATION.NONE)
      return navigationAnimation;

    const { historyIndex: prevHistoryIndex } = useHistoryStore.getState();

    const historyIndex: number | undefined = history.state.historyIndex;

    if (historyIndex === undefined) return navigationAnimation;

    if (historyIndex < prevHistoryIndex)
      return NAVIGATION_ANIMATION.FROM_TOP_AUTO;

    if (historyIndex > prevHistoryIndex)
      return NAVIGATION_ANIMATION.FROM_BOTTOM_AUTO;

    return navigationAnimation;
  })();

  const animation = ANIMATION_GROUP[animationKey];

  const initTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.main
        {...animation}
        key={url}
        /* @ts-expect-error - 🚧 임시로 해결 추후 @types/react 버전 업데이트 시 삭제 */
        className="flex flex-1 flex-col overflow-auto"
        onAnimationComplete={(e: { opacity: number }) => {
          if (e.opacity) {
            initTimeout.current = setTimeout(() => {
              setNavigationAnimation(NAVIGATION_ANIMATION.NONE);
            }, 1000);
          } else {
            if (initTimeout.current) {
              clearTimeout(initTimeout.current);
              initTimeout.current = null;
            }
          }
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};
