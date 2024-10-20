'use client';

import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useHistoryStore } from '@/stores/history';
import { cn } from '@/utils/cn';

const Template = ({ children }: { children: React.ReactNode }) => {
  const [lastRouteType, rootAnimation, setRootAnimation] = useHistoryStore(
    (state) => [
      state.lastRouteType ?? 'reload',
      state.rootAnimation,
      state.setRootAnimation,
    ],
    shallow,
  );

  useEffect(() => {
    if (!rootAnimation) return;

    const timer = setTimeout(() => setRootAnimation(undefined), 300);

    return () => clearTimeout(timer);
  }, [rootAnimation, setRootAnimation, lastRouteType]);

  console.info(rootAnimation);

  return (
    <main
      className={cn(
        'flex-1 animate-duration-300 flex flex-col overflow-auto',
        {
          'animate-fade-down': lastRouteType === 'back',
          'animate-fade-up': ['forward', 'push'].includes(lastRouteType),
        },
        {
          'animate-fade-left': rootAnimation === 'left',
          'animate-fade-right': rootAnimation === 'right',
        },
      )}
    >
      {children}
    </main>
  );
};

export default Template;
