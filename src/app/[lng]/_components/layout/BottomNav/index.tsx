'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findCurrentRoute } from '@/utils';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();

  const { bottomNavType } = findCurrentRoute(pathname);

  return bottomNavType !== 'none' ? (
    <footer className="sticky bottom-0 z-10" id={SELECTOR.BOTTOM_NAV}>
      {
        {
          root: <RootNav pathname={pathname} />,
          empty: null,
        }[bottomNavType]
      }
    </footer>
  ) : null;
};
