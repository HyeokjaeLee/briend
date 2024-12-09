import { type PropsWithChildren } from 'react';

import { AnimationMain } from './AnimationMain';
import { FrozenRouter } from './FrozenRouter';

export const MainContainer = ({ children }: PropsWithChildren) => {
  return (
    <AnimationMain>
      <FrozenRouter>{children}</FrozenRouter>
    </AnimationMain>
  );
};
