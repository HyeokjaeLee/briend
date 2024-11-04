'use client';

import { useShallow } from 'zustand/shallow';

import { Suspense, useEffect } from 'react';

import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { useUrl } from '@/hooks/useUrl';
import { useGlobalStore } from '@/stores/global';
import { cn } from '@/utils/cn';

const GlobalLoadingController = () => {
  const [globalLoading, setGlobalLoading] = useGlobalStore(
    useShallow((state) => [state.globalLoading, state.setGlobalLoading]),
  );

  const { value: isLoading, options } = globalLoading;

  const delay = options?.delay ?? 300;

  const url = useUrl();

  useEffect(() => {
    if (!isLoading) return;

    return () => setGlobalLoading(false);
  }, [url, isLoading, setGlobalLoading]);

  return isLoading ? (
    <LoadingTemplate
      className={cn(
        'absolute animate-fade bg-slate-200/50 backdrop-blur-xl animate-duration-150',
        {
          0: 'animate-delay-0',
          100: 'animate-delay-100',
          200: 'animate-delay-200',
          300: 'animate-delay-300',
        }[delay],
      )}
    />
  ) : null;
};

export const GlobalLoading = () => (
  <Suspense>
    <GlobalLoadingController />
  </Suspense>
);
