import Image from 'next/image';

import LogoWithText from '@/assets/LogoWithText.svg';

import { LayoutTab } from './LayoutTab';
import { Menu } from './Menu';

export const LayoutHeader = () => (
  <header
    className={`bg-black px-5 flex items-center justify-between h-nav z-10 sticky top-0`}
  >
    <div className="flex items-center gap-1">
      <Image src={LogoWithText} alt="logo" className="h-8 w-28" />
      <LayoutTab />
    </div>
    <Menu />
  </header>
);
