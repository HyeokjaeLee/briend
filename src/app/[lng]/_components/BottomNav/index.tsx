'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useRef } from 'react';

import { IS_CLIENT } from '@/constants/etc';
import { SELECTOR } from '@/constants/selector';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { findRoute } from '@/utils/findRoute';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();

  const { bottomNavType } = findRoute(pathname);
  const prevBottomNavType = useRef(bottomNavType);

  const isIntercepting = !!(
    IS_CLIENT && sessionStorage.getItem(SESSION_STORAGE.ONLY_INTERCEPT)
  );

  useEffect(() => {
    if (!isIntercepting) {
      prevBottomNavType.current = bottomNavType;
    }
  }, [bottomNavType, isIntercepting]);

  const currentBottomNavType = isIntercepting
    ? prevBottomNavType.current
    : bottomNavType;

  return currentBottomNavType !== 'none' ? (
    <footer
      key={bottomNavType}
      className="w-full max-w-screen-md"
      id={SELECTOR.BOTTOM_NAV}
    >
      {
        {
          root: <RootNav pathname={pathname} />,
          empty: null,
        }[currentBottomNavType]
      }
    </footer>
  ) : null;
};
