'use client';

import { useShallow } from 'zustand/shallow';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type PropsWithChildren,
} from 'react';

import { useUrl } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';
import {
  getNavigationAnimationClasses,
  NAVIGATION_ANIMATION_DURATION,
} from '@/utils/client';

export const MainContainer = ({ children }: PropsWithChildren) => {
  const url = useUrl();

  const [
    navigationAnimation,
    setNavigationAnimation,
    animationType,
    setAnimationType,
  ] = useGlobalStore(
    useShallow((state) => [
      state.navigationAnimation,
      state.setNavigationAnimation,
      state.animationType,
      state.setAnimationType,
    ]),
  );

  const isPendingRef = useRef(false);

  useEffect(() => {
    if (animationType === 'EXIT') {
      isPendingRef.current = true;
    }
  }, [animationType]);

  useLayoutEffect(() => {
    if (!isPendingRef.current) return;

    isPendingRef.current = false;
    setAnimationType('ENTER');

    const timer = setTimeout(() => {
      setNavigationAnimation('NONE');
    }, NAVIGATION_ANIMATION_DURATION.ENTER);

    return () => clearTimeout(timer);
  }, [url, setAnimationType, setNavigationAnimation]);

  return (
    <main
      className={cn(
        'flex size-full flex-col overflow-auto',
        isPendingRef.current
          ? 'invisible overflow-hidden'
          : getNavigationAnimationClasses({
              animationType,
              navigationAnimation,
            }),
      )}
    >
      {children}
    </main>
  );
};
