'use client';

import { BiArrowBack } from 'react-icons/bi';

import Logo from '@/assets/logo.svg';
import { CustomIconButton } from '@/components/CustomIconButton';

export const BackHeader = () => {
  return (
    <nav className="flex h-14 items-center justify-between bg-white px-5">
      <BiArrowBack />
    </nav>
  );
};
