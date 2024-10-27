'use client';

import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { useEffect, useState } from 'react';

import { useHistoryStore } from '@/stores/history';
import { cn } from '@/utils/cn';

const Template = ({ children }: { children: React.ReactNode }) => {
  const [lastRouteType, rootAnimation, setRootAnimation] = useHistoryStore(
    useShallow((state) => [
      state.lastRouteType ?? 'reload',
      state.rootAnimation,
      state.setRootAnimation,
    ]),
  );

  const pathname = usePathname();

  const [isAnimatedOut, setIsAnimatedOut] = useState(false);

  useEffect(() => {
    const { rootAnimation } = useHistoryStore.getState();

    setIsAnimatedOut(!!rootAnimation?.includes('out'));
  }, [pathname]);

  useEffect(() => {
    if (!isAnimatedOut) return;

    setIsAnimatedOut(false);
    if (rootAnimation === 'left-out') {
      setRootAnimation('left');
    } else if (rootAnimation === 'right-out') {
      setRootAnimation('right');
    }
  }, [isAnimatedOut, rootAnimation, setRootAnimation]);

  useEffect(() => {
    if (rootAnimation === 'left' || rootAnimation === 'right') {
      setTimeout(() => {
        setRootAnimation(undefined);
      }, 300);
    }
  }, [rootAnimation, setIsAnimatedOut, setRootAnimation]);

  return (
    <main
      className={cn(
        'flex-1 animate-duration-300 flex flex-col overflow-auto',
        {
          'animate-fade-down': lastRouteType === 'back',
          'animate-fade-up': ['forward', 'push'].includes(lastRouteType),
        },
        {
          'animate-fade-right animate-reverse animate-duration-75':
            rootAnimation === 'left-out',
          'animate-fade-lett animate-reverse animate-duration-75':
            rootAnimation === 'right-out',
        },
        isAnimatedOut
          ? 'invisible'
          : {
              'animate-fade-left animate-duration-200':
                rootAnimation === 'left',
              'animate-fade-right animate-duration-200':
                rootAnimation === 'right',
            },
      )}
    >
      {children}
    </main>
  );
};

export default Template;
