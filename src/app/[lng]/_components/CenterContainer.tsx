'use client';

import { type PropsWithChildren } from 'react';

import { ROUTES } from '@/routes/client';
import { useSidePanelStore } from '@/stores';
import { cn } from '@/utils';

export const CenterContainer = ({ children }: PropsWithChildren) => {
  const isHome = useSidePanelStore(
    (state) => state.sidePanelUrl === ROUTES.FRIEND_LIST.pathname,
  );

  return (
    <div
      className={cn(
        'relative flex size-full flex-1 flex-col overflow-hidden text-slate-900',
        isHome
          ? 'sm:shadow-lg-right xl:shadow-lg-x'
          : 'xl:shadow-lg-left sm:border-r sm:border-slate-100 sm:shadow-none',
      )}
    >
      {children}
    </div>
  );
};
