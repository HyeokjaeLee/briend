import { Suspense } from 'react';

export const createSuspensedComponent = <T extends object>(
  Component: React.ComponentType<T>,
  Fallback?: React.ComponentType<T>,
) => {
  const SuspensedComponent: React.ComponentType<T> = (props) => (
    <Suspense fallback={Fallback ? <Fallback {...props} /> : null}>
      <Component {...props} />
    </Suspense>
  );

  return SuspensedComponent;
};
