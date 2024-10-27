'use client';

import type { HTMLMotionProps } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';

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
  },
  [NAVIGATION_ANIMATION.FROM_RIGHT]: {
    initial: { x: 300, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  },
};

export const Main = ({ children }: PropsWithChildren) => {
  const segment = usePathname();

  const navigationAnimation = useGlobalStore(
    (state) => state.navigationAnimation,
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
        transition={{ duration: 0.15 }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.main>
    </AnimatePresence>
  );
};
