'use client';

import { useLayoutEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { LoadingTemplate } from '@/components';
import { useUrl } from '@/hooks';
import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

export const GlobalLoading = createOnlyClientComponent(() => {
  const [globalLoading, setGlobalLoading] = useGlobalStore(
    useShallow((state) => [state.globalLoading, state.setGlobalLoading]),
  );

  const { value: isLoading, options } = globalLoading;

  const delay = options?.delay ?? 300;

  const url = useUrl();

  useLayoutEffect(() => {
    setGlobalLoading(false);
  }, [url, setGlobalLoading]);

  return isLoading ? (
    <LoadingTemplate
      className={cn(
        'animate-fade fixed bg-black/80 backdrop-blur-sm animate-duration-150 z-global-loading',
        {
          0: 'animate-delay-0',
          100: 'animate-delay-100',
          200: 'animate-delay-200',
          300: 'animate-delay-300',
        }[delay],
      )}
    />
  ) : null;
});
