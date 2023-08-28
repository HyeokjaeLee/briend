'use client';

import { Button } from '@hyeokjaelee/pastime-ui';

import { useCheckLogin } from '../_hooks/useCheckLogin';

export const LogoutButton = () => {
  const { isLogin, logout } = useCheckLogin();
  return isLogin ? <Button onClick={logout}>Logout</Button> : <></>;
};
