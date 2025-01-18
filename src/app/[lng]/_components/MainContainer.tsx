'use client';

import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { useEffect, useRef, type PropsWithChildren } from 'react';

import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export const MainContainer = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isMountedRef = useRef(false);

  const [navigationAnimation, setNavigationAnimation] = useGlobalStore(
    useShallow((state) => [
      state.navigationAnimation,
      state.setNavigationAnimation,
    ]),
  );

  useEffect(() => {
    isMountedRef.current = true;

    const timer = setTimeout(() => {
      setNavigationAnimation('NONE');
    }, 150);

    return () => {
      isMountedRef.current = false;
      setNavigationAnimation('NONE');
      clearTimeout(timer);
    };
  }, [pathname, setNavigationAnimation]);

  return (
    <main
      className={cn(
        'flex size-full flex-col overflow-hidden',
        navigationAnimation === 'NONE'
          ? 'overflow-auto'
          : isMountedRef.current
            ? [
                'animate-duration-75 animate-reverse',
                {
                  'animate-fade-down': navigationAnimation === 'FROM_TOP',
                  'animate-fade-up': navigationAnimation === 'FROM_BOTTOM',
                  'animate-fade-left': navigationAnimation === 'FROM_LEFT',
                  'animate-fade-right': navigationAnimation === 'FROM_RIGHT',
                },
              ]
            : [
                'animate-duration-150',
                {
                  'animate-fade-down': navigationAnimation === 'FROM_TOP',
                  'animate-fade-up': navigationAnimation === 'FROM_BOTTOM',
                  'animate-fade-left': navigationAnimation === 'FROM_LEFT',
                  'animate-fade-right': navigationAnimation === 'FROM_RIGHT',
                },
              ],
      )}
    >
      {children}
    </main>
  );
};
