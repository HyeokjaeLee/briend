'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findRoute } from '@/utils/findRoute';

import { BackHeader } from './_components/BackHeader';
import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findRoute(pathname);

  return (
    <>
      {topHeaderType !== 'none' ? (
        <header
          key={topHeaderType}
          className="relative top-0 h-fit w-full max-w-xl animate-fade-down animate-duration-75"
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
      ) : null}
    </>
  );
};
