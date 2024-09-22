'use client';

import { usePathname } from 'next/navigation';

import type { LANGUAGE } from '@/constants/language';
import { SELECTOR } from '@/constants/selector';
import { findCurrentRoute } from '@/utils';

import { BackHeader } from './_components/BackHeader';
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
          back: <BackHeader />,
          empty: null,
        }[topHeaderType]
      }
    </header>
  ) : null;
};
