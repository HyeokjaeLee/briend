'use client';

import { useRouter } from 'next/navigation';
import { UserPlus, Users } from 'react-feather';

import { useGlobalStore } from '@/store/useGlobalStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { DarkModeSwitch } from './DarkModeSwitch';
import { KakaoAuthButton } from './KakaoAuthButton';
import { MenuItem } from './MenuItem';
import { ChattingRoomInfoMenuItem } from '../../../components/ChattingRoomInfoMenuItem';

export const GlobalMenu = () => {
  const [opened, setOpened] = useGlobalStore((state) => [
    state.globalMenuOpened,
    state.setGlobalMenuOpened,
  ]);

  const router = useRouter();

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <ChattingRoomInfoMenuItem />
          <MenuItem>
            <Users className="ml-1" /> 이전 대화
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpened(false);
              router.push('/invite');
            }}
          >
            <UserPlus className="ml-1" /> 친구 초대
          </MenuItem>
        </ul>
        <div className="flex w-full flex-col gap-2">
          <DarkModeSwitch />
          <KakaoAuthButton />
        </div>
      </div>
    </Drawer>
  );
};
