'use client';

import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';
import { UserPlus, Users } from 'react-feather';

import { LANGUAGE_PACK } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { DarkModeSwitch } from './DarkModeSwitch';
import { KakaoAuthButton } from './KakaoAuthButton';
import { MenuItem } from './MenuItem';

export const GlobalMenu = () => {
  const [opened, setOpened, deviceLanguage] = useGlobalStore(
    (state) => [
      state.globalMenuOpened,
      state.setGlobalMenuOpened,
      state.deviceLanguage,
    ],
    shallow,
  );

  const isLogin = useAuthStore((state) => state.isLogin);

  const router = useRouter();

  const iconClassName = 'ml-1 w-5 h-5';

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <MenuItem
            onClick={() => {
              setOpened(false);
              router.push('/chat/history');
            }}
          >
            <Users className={iconClassName} />{' '}
            {LANGUAGE_PACK.CHATTING_HISTORY[deviceLanguage]}
          </MenuItem>
          <MenuItem
            disabled={!isLogin}
            onClick={() => {
              setOpened(false);
              router.push('/invite');
            }}
          >
            <UserPlus className={iconClassName} />{' '}
            {LANGUAGE_PACK.CREATE_CHATTING_ROOM[deviceLanguage]}
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
