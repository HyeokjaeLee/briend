import { Suspense } from 'react';

import { HistoryObserver } from './_components/template/HistoryObserver';
import { PagingAnimation } from './_components/template/PagingAnimation';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <HistoryObserver />
      </Suspense>
      <PagingAnimation>
        {children}
        <div className="h-dvh" />
      </PagingAnimation>
    </>
  );
}
