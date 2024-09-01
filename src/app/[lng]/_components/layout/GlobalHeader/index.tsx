'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findCurrentRoute } from '@/utils';

import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findCurrentRoute(pathname);

  return topHeaderType !== 'none' ? (
    <nav
      className="flex h-14 items-center justify-between px-5"
      id={SELECTOR.TOP_HEADER}
    >
      {
        {
          root: <RootHeader />,
          empty: null,
        }[topHeaderType]
      }
    </nav>
  ) : null;
};
