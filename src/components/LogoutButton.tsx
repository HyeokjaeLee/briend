'use client';

import { LogOut } from 'react-feather';

import { useLogout } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@hyeokjaelee/pastime-ui';

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);

  const { logout } = useLogout();

  return isLogin ? (
    <Button
      icon={<LogOut />}
      onClick={() => {
        logout();
        onClick?.();
      }}
      className="font-medium"
      size="large"
      theme="danger"
    >
      Logout
    </Button>
  ) : null;
};
