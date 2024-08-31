'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { VscHome, VscEllipsis, VscCommentDiscussion } from 'react-icons/vsc';

import { ROUTES } from '@/routes/client';
import { findCurrentRoute } from '@/utils';
import { Button } from '@radix-ui/themes';

import { RootNav } from './_components/RootNav';

export const BottomNav = () => {
  const pathname = usePathname();

  const currentRoute = findCurrentRoute(pathname);

  return (
    <footer className="w-full">
      <RootNav pathname={pathname} />
    </footer>
  );
};
