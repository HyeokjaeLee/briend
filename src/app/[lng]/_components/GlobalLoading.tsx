'use client';

import { useLayoutEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { Spinner } from '@/components';
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
    <div
      className={cn(
        'flex-center z-global-loading fixed size-full flex-1 cursor-wait bg-black/80 backdrop-blur-sm',
        'animate-fade animate-duration-150',
        {
          0: 'animate-delay-0',
          100: 'animate-delay-100',
          200: 'animate-delay-200',
          300: 'animate-delay-300',
        }[delay],
      )}
    >
      <Spinner className="size-40" />
    </div>
  ) : null;
});
