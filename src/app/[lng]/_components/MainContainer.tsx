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
    }, 150);

    return () => clearTimeout(timer);
  }, [url, setAnimationType, setNavigationAnimation]);

  const hasAnimation = navigationAnimation !== 'NONE';

  return (
    <main
      className={cn(
        'flex size-full flex-col overflow-auto',
        isPendingRef.current
          ? 'invisible overflow-hidden'
          : animationType === 'ENTER'
            ? [
                'animate-duration-150',
                hasAnimation &&
                  {
                    FROM_LEFT: 'animate-fade-left',
                    FROM_RIGHT: 'animate-fade-right',
                    FROM_TOP: 'animate-fade-down',
                    FROM_BOTTOM: 'animate-fade-up',
                  }[navigationAnimation],
              ]
            : [
                'animate-reverse animate-duration-75',
                hasAnimation &&
                  {
                    FROM_LEFT: 'animate-fade-right',
                    FROM_RIGHT: 'animate-fade-left',
                    FROM_TOP: 'animate-fade-up',
                    FROM_BOTTOM: 'animate-fade-down',
                  }[navigationAnimation],
              ],
      )}
    >
      {children}
    </main>
  );
};
