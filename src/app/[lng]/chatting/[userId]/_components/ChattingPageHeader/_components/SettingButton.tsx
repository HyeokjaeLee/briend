import { RiSettings2Line } from 'react-icons/ri';

import { Button } from '@/components';

export const SettingButton = () => {
  return (
    <Button variant="ghost" onlyIcon>
      <RiSettings2Line className="size-6 text-slate-900" />
    </Button>
  );
};
