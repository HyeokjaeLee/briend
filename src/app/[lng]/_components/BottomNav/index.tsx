'use client';

import { usePathname } from 'next/navigation';

import { SELECTOR } from '@/constants/selector';
import { findRoute } from '@/utils/findRoute';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();
  const { bottomNavType } = findRoute(pathname);

  return bottomNavType !== 'none' ? (
    <footer
      className="w-full max-w-xl animate-fade-up animate-duration-150"
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
