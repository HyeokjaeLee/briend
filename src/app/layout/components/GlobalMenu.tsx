'use client';

import { useRouter } from 'next/navigation';
import { UserPlus, Users } from 'react-feather';

import { useAuthStore } from '@/store/useAuthStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { DarkModeSwitch } from './DarkModeSwitch';
import { KakaoAuthButton } from './KakaoAuthButton';
import { MenuItem } from './MenuItem';

export const GlobalMenu = () => {
  const [opened, setOpened] = useGlobalStore((state) => [
    state.globalMenuOpened,
    state.setGlobalMenuOpened,
  ]);

  const isLogin = useAuthStore((state) => state.isLogin);

  const router = useRouter();

  const iconClassName = 'ml-1 w-5 h-5';

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <MenuItem>
            <Users className={iconClassName} /> 이전 대화
          </MenuItem>
          <MenuItem
            disabled={!isLogin}
            onClick={() => {
              setOpened(false);
              router.push('/invite');
            }}
          >
            <UserPlus className={iconClassName} /> 친구 초대
          </MenuItem>
        </ul>
        <div className="flex w-full flex-col gap-4">
          <DarkModeSwitch />
          <KakaoAuthButton />
        </div>
      </div>
    </Drawer>
  );
};
