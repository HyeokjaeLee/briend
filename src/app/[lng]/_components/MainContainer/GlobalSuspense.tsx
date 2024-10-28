import { Suspense, type PropsWithChildren } from 'react';

import { LoadingTemplate } from '@/components/templates/LoadingTemplate';

export const GlobalSuspense = ({ children }: PropsWithChildren) => {
  return (
    <Suspense
      fallback={<LoadingTemplate className="animate-fade animate-delay-300" />}
    >
      {children}
    </Suspense>
  );
};
