import { Suspense } from 'react';

import { IS_CLIENT } from '@/constants';

interface CreateSuspensedComponentOptions<T> {
  fallback?: React.ComponentType<T>;
  ssrFallback?: boolean;
}

export const createSuspensedComponent = <T extends object>(
  Component: React.ComponentType<T>,
  options?: CreateSuspensedComponentOptions<T>,
) => {
  const { fallback: Fallback, ssrFallback } = options ?? {};

  const SuspensedComponent: React.ComponentType<T> = (props) => {
    if (ssrFallback && !IS_CLIENT && Fallback) return <Fallback {...props} />;

    return (
      <Suspense fallback={Fallback ? <Fallback {...props} /> : null}>
        <Component {...props} />
      </Suspense>
    );
  };

  return SuspensedComponent;
};
