'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { Suspense, useEffect } from 'react';

import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { useGlobalStore } from '@/stores/global';

const GlobalLoadingController = () => {
  const [isLoading, setIsLoading] = useGlobalStore(
    useShallow((state) => [state.isLoading, state.setIsLoading]),
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) return;

    return () => setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, isLoading]);

  return isLoading ? (
    <LoadingTemplate className="absolute animate-fade bg-slate-850/80 backdrop-blur-xl animate-delay-150 animate-duration-150" />
  ) : null;
};

export const GlobalLoading = () => (
  <Suspense>
    <GlobalLoadingController />
  </Suspense>
);
