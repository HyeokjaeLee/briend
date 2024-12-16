'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useRef } from 'react';

import { IS_CLIENT } from '@/constants/etc';
import { SELECTOR } from '@/constants/selector';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { findRoute } from '@/utils/findRoute';

import { BackHeader } from './_components/BackHeader';
import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findRoute(pathname);
  const prevTopHeaderType = useRef(topHeaderType);

  const isIntercepting = !!(
    IS_CLIENT && sessionStorage.getItem(SESSION_STORAGE.ONLY_INTERCEPT)
  );

  useEffect(() => {
    if (!isIntercepting) {
      prevTopHeaderType.current = topHeaderType;
    }
  }, [topHeaderType, isIntercepting]);

  const currentTopHeaderType = isIntercepting
    ? prevTopHeaderType.current
    : topHeaderType;

  return (
    <>
      {currentTopHeaderType !== 'none' ? (
        <header
          key={topHeaderType}
          className="relative top-0 h-fit w-full max-w-screen-md"
          id={SELECTOR.TOP_HEADER}
        >
          {
            {
              root: <RootHeader />,
              back: <BackHeader />,
              empty: null,
            }[currentTopHeaderType]
          }
        </header>
      ) : null}
    </>
  );
};
