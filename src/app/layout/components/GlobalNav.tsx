'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu } from 'react-feather';

import LogoWithText from '@/assets/LogoWithText.svg';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Button } from '@hyeokjaelee/pastime-ui';

import { LayoutTab } from './LayoutTab';

export const GlobalNav = () => {
  const router = useRouter();
  const setMenuOpened = useGlobalStore((state) => state.setGlobalMenuOpened);
  return (
    <header className="bg-black px-5 flex items-center justify-between z-10 top-0 h-nav">
      <div className="flex items-center gap-1">
        <Image
          src={LogoWithText}
          priority
          alt="logo"
          className="h-8 w-28 cursor-pointer"
          onClick={() => router.push('/')}
        />
        <LayoutTab />
      </div>
      <Button
        theme="clear"
        onClick={() => setMenuOpened(true)}
        fixedDarkMode="dark"
        icon={<Menu size="1.3rem" />}
      />
    </header>
  );
};
