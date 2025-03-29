'use client';

import { type ComponentType, Suspense, useLayoutEffect, useState } from 'react';

import { IS_CLIENT } from '@/constants';

interface CreateSuspendedComponentOptions<T> {
  fallback?: ComponentType<T>;
  ssrFallback?: boolean;
}

export const createSuspendedComponent = <T extends object>(
  Component: ComponentType<T>,
  options?: CreateSuspendedComponentOptions<T>,
) => {
  const { fallback: Fallback, ssrFallback } = options ?? {};

  const SuspendedComponent: React.ComponentType<T> = (props) => {
    const [isLoading, setIsLoading] = useState(!!(ssrFallback && Fallback));

    useLayoutEffect(() => {
      if (ssrFallback && Fallback && IS_CLIENT) setIsLoading(false);
    }, []);

    if (isLoading && Fallback) return <Fallback {...props} />;

    return (
      <Suspense fallback={Fallback ? <Fallback {...props} /> : null}>
        <Component {...props} />
      </Suspense>
    );
  };

  return SuspendedComponent;
};
