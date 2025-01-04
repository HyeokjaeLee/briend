import { Suspense, type PropsWithChildren } from 'react';

import { LoadingTemplate } from '@/components';

export const LoadingSuspense = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<LoadingTemplate className="z-0 animate-fade" />}>
      {children}
    </Suspense>
  );
};
