'use client';

import { useState } from 'react';
import { Menu as MenuIcon, Trash2, UserPlus } from 'react-feather';

import { Button, Drawer } from '@hyeokjaelee/pastime-ui';

import { LogoutButton } from './LogoutButton';
import { MenuItem } from './MenuItem';

export const Menu = () => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <Button
        theme="clear"
        onClick={() => setIsOpened(true)}
        icon={<MenuIcon />}
      />
      <Drawer
        opened={isOpened}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <Drawer.Header closeButton />
        <div className="flex flex-col justify-between h-full">
          <ul className="flex flex-col gap-2">
            <MenuItem>
              <UserPlus className="ml-1" /> 초대 링크 생성
            </MenuItem>
            <MenuItem>
              <Trash2 /> 채팅 기록 삭제
            </MenuItem>
          </ul>
          <LogoutButton onClick={() => setIsOpened(false)} />
        </div>
      </Drawer>
    </>
  );
};
