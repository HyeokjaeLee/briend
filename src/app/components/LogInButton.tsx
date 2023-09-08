'use client';

import { useRouter } from 'next/navigation';
import { LogIn } from 'react-feather';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@hyeokjaelee/pastime-ui';

export const LogInButton = () => {
  const router = useRouter();
  const isLogin = useAuthStore(({ isLogin }) => isLogin);

  return isLogin ? null : (
    <Button
      theme="ghost"
      icon={<LogIn />}
      className="w-28 font-semibold"
      onClick={() => router.push('/auth')}
      fixedDarkMode="dark"
    >
      로그인
    </Button>
  );
};
