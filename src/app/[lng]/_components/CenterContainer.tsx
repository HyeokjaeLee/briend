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
        'relative flex flex-1 size-full max-h-cdvh min-h-cdvh w-full flex-col overflow-hidden text-slate-900',
        isHome
          ? 'sm:shadow-lg-right xl:shadow-lg-x'
          : 'sm:shadow-none sm:border-r sm:border-slate-100 xl:shadow-lg-left',
      )}
    >
      {children}
    </div>
  );
};
