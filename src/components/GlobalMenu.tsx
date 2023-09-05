'use client';

import { Trash2, UserPlus, Users } from 'react-feather';

import { useLayoutStore } from '@/hooks/useLayoutStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { KakaoLogoutButton } from './KakaoLogoutButton';
import { MenuItem } from './MenuItem';

export const GlobalMenu = () => {
  const [
    opened,
    setOpened,
    setAddChattingRoomModalOpened,
    setChattingHistoryModalOpened,
  ] = useLayoutStore((state) => [
    state.globalMenuOpened,
    state.setGlobalMenuOpened,
    state.setAddChattingRoomModalOpened,
    state.setChattingHistoryModalOpened,
  ]);

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <MenuItem
            onClick={() => {
              setChattingHistoryModalOpened(true);
              setOpened(false);
            }}
          >
            <Users className="ml-1" /> 이전 대화
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAddChattingRoomModalOpened(true);
              setOpened(false);
            }}
          >
            <UserPlus className="ml-1" /> 초대 링크 생성
          </MenuItem>
          <MenuItem>
            <Trash2 /> 채팅 기록 삭제
          </MenuItem>
        </ul>
        <KakaoLogoutButton />
      </div>
    </Drawer>
  );
};
