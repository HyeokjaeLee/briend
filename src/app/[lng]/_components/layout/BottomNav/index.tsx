'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findRoute } from '@/utils';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();
  const { bottomNavType } = findRoute(pathname);

  return bottomNavType !== 'none' ? (
    <footer className="w-full max-w-xl" id={SELECTOR.BOTTOM_NAV}>
      {
        {
          root: <RootNav pathname={pathname} />,
          empty: null,
        }[bottomNavType]
      }
    </footer>
  ) : null;
};
