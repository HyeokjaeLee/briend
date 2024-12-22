'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants';
import { findRoute } from '@/utils';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();

  const { bottomNavType } = findRoute(pathname);

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
