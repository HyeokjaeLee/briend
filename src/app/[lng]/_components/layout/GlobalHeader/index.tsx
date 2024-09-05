'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findCurrentRoute } from '@/utils';

import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findCurrentRoute(pathname);

  return topHeaderType !== 'none' ? (
    <header className="sticky top-0 z-10" id={SELECTOR.TOP_HEADER}>
      {
        {
          root: <RootHeader />,
          empty: null,
        }[topHeaderType]
      }
    </header>
  ) : null;
};
