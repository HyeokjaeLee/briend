import { VscBell } from 'react-icons/vsc';

import Logo from '@/assets/logo.svg';
import { CustomIconButton } from '@/components/CustomIconButton';

export const RootHeader = () => {
  return (
    <nav className="flex h-14 items-center justify-between bg-white px-5">
      <Logo className="h-7 text-gray-600" />
      <CustomIconButton className="rounded-full" variant="ghost">
        <VscBell className="size-7" />
      </CustomIconButton>
    </nav>
  );
};
