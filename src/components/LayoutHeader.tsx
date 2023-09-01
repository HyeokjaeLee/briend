'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import LogoWithText from '@/assets/LogoWithText.svg';

import { LayoutTab } from './LayoutTab';
import { Menu } from './Menu';

export const LayoutHeader = () => {
  const router = useRouter();
  return (
    <header
      className={`bg-black px-5 flex items-center justify-between h-nav z-10 sticky top-0`}
    >
      <div className="flex items-center gap-1">
        <Image
          src={LogoWithText}
          alt="logo"
          className="h-8 w-28 cursor-pointer"
          onClick={() => router.push('/')}
        />
        <LayoutTab />
      </div>
      <Menu />
    </header>
  );
};
