'use client';

import { useCheckLogin } from '@/hooks';
import { Button, useToast } from '@hyeokjaelee/pastime-ui';

export const LogoutButton = () => {
  const { isLogin, logout } = useCheckLogin();
  const { toast } = useToast();

  return isLogin ? (
    <Button
      onClick={() => {
        logout();
        toast({
          message: '로그아웃 되었습니다.',
        });
      }}
      theme="secondary"
    >
      로그아웃
    </Button>
  ) : (
    <></>
  );
};
