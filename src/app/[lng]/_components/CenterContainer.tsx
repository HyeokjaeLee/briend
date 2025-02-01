'use client';

import { useShallow } from 'zustand/shallow';

import { useLayoutEffect, type PropsWithChildren } from 'react';

import { LoadingTemplate } from '@/components';
import { useUrl } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore, useSidePanelStore } from '@/stores';
import { cn } from '@/utils';

export const CenterContainer = ({ children }: PropsWithChildren) => {
  const isHome = useSidePanelStore(
    (state) => state.sidePanelUrl === ROUTES.FRIEND_LIST.pathname,
  );

  const [globalLoading, setGlobalLoading] = useGlobalStore(
    useShallow((state) => [state.globalLoading, state.setGlobalLoading]),
  );

  const { value: isLoading, options } = globalLoading;

  const delay = options?.delay ?? 300;

  const url = useUrl();

  useLayoutEffect(() => {
    setGlobalLoading(false);
  }, [url, setGlobalLoading]);

  return (
    <div
      className={cn(
        'relative flex flex-1 size-full max-h-cdvh min-h-cdvh w-full flex-col overflow-hidden text-slate-900',
        'sm:shadow-lg-right xl:shadow-lg-x',
        isHome ||
          'sm:shadow-none sm:border-r sm:border-slate-100 xl:shadow-lg-left',
      )}
    >
      {children}
      <LoadingTemplate
        className={cn(
          'absolute animate-fade bg-slate-200/50 backdrop-blur-xl animate-duration-150',
          {
            0: 'animate-delay-0',
            100: 'animate-delay-100',
            200: 'animate-delay-200',
            300: 'animate-delay-300',
          }[delay],
          {
            '!hidden': !isLoading,
          },
        )}
      />
    </div>
  );
};
