'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants';
import { useGlobalStore } from '@/stores';
import { findRoute } from '@/utils';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();

  let { bottomNavType } = findRoute(pathname);

  const isErrorRoute = useGlobalStore((state) => state.isErrorRoute);

  if (isErrorRoute) {
    bottomNavType = 'empty';
  }

  return bottomNavType !== 'none' ? (
    <footer
      key={bottomNavType}
      className="w-full max-w-screen-sm"
      id={SELECTOR.BOTTOM_NAV}
    >
      {
        {
          root: <RootNav pathname={pathname} />,
          empty: null,
        }[bottomNavType]
      }
    </footer>
  ) : null;
};
