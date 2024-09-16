'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findCurrentRoute } from '@/utils';

import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findCurrentRoute(pathname);

  return topHeaderType !== 'none' ? (
    <header
      className="relative top-0 h-fit w-full max-w-xl"
      id={SELECTOR.TOP_HEADER}
    >
      {
        {
          root: <RootHeader />,
          empty: null,
        }[topHeaderType]
      }
    </header>
  ) : null;
};
