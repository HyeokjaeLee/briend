import { Suspense, type PropsWithChildren } from 'react';

import { LoadingTemplate } from '@/components';

export const GlobalSuspense = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<LoadingTemplate className="animate-fade" />}>
      {children}
    </Suspense>
  );
};
