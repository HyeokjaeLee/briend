import { SessionProvider } from 'next-auth/react';

import type { RefAttributes } from 'react';

import type { ThemeProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';

export const GlobalProvider = (
  props: ThemeProps & RefAttributes<HTMLDivElement>,
) => {
  return (
    <SessionProvider>
      <Theme {...props} />
    </SessionProvider>
  );
};
