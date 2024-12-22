'use client';

import { useShallow } from 'zustand/shallow';

import { memo, useLayoutEffect } from 'react';

import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { useUrl } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export const GlobalLoading = memo(() => {
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
  );
});

GlobalLoading.displayName = 'GlobalLoading';
