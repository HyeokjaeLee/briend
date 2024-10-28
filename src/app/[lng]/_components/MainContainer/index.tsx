import type { PropsWithChildren } from 'react';

import { AnimationMain } from './AnimationMain';
import { FrozenRouter } from './FrozenRouter';
import { GlobalSuspense } from './GlobalSuspense';

export const Main = ({ children }: PropsWithChildren) => {
  return (
    <GlobalSuspense>
      <AnimationMain>
        <FrozenRouter>{children}</FrozenRouter>
      </AnimationMain>
    </GlobalSuspense>
  );
};
