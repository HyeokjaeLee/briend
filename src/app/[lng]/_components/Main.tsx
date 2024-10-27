'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import type { PropsWithChildren } from 'react';
import { useContext, useEffect, useRef } from 'react';

import { NAVIGATION_ANIMATION } from '@/constants/etc';
import { useGlobalStore } from '@/stores/global';

function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T>();

  useEffect(() => {
    prevValue.current = value;

    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
}

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;
  const segment = usePathname();
  const prevSegment = usePreviousValue(segment);
  const changed =
    segment !== prevSegment &&
    segment !== undefined &&
    prevSegment !== undefined;

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

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

export const Main = ({ children }: PropsWithChildren) => {
  const segment = usePathname();

  const [navigationAnimation, setNavigationAnimation] = useGlobalStore(
    useShallow((state) => [
      state.navigationAnimation,
      state.setNavigationAnimation,
    ]),
  );

  const animation = navigationAnimation
    ? ANIMATION_GROUP[navigationAnimation]
    : {};

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.main
        {...animation}
        key={segment}
        className="flex flex-1 flex-col overflow-auto"
        transition={{ duration: 0.075 }}
        onAnimationEnd={() => {
          setNavigationAnimation(null);
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.main>
    </AnimatePresence>
  );
};
