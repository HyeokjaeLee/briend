'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants';
import { useGlobalStore } from '@/stores';
import { findRoute } from '@/utils';

import { BackHeader } from './_components/BackHeader';
import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  let { topHeaderType } = findRoute(pathname);

  const isErrorRoute = useGlobalStore((state) => state.isErrorRoute);

  if (isErrorRoute) {
    topHeaderType = 'empty';
  }

  return (
    <>
      {topHeaderType !== 'none' ? (
        <header
          key={topHeaderType}
          className="relative top-0 h-fit w-full max-w-(--breakpoint-sm)"
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
