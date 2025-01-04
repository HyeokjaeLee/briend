import { RiSettings2Line } from 'react-icons/ri';

import { CustomIconButton } from '@/components';

export const SettingButton = () => {
  return (
    <CustomIconButton size="3" variant="ghost">
      <RiSettings2Line className="size-6 text-slate-900" />
    </CustomIconButton>
  );
};
