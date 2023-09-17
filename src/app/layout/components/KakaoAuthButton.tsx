'use client';

import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'react-feather';

import { PATH } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoAuthButton = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const router = useRouter();
  const setGlobalMenuOpened = useGlobalStore(
    (state) => state.setGlobalMenuOpened,
  );

  return isLogin ? (
    <Button
      icon={<LogOut />}
      onClick={() => {
        window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&logout_redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}${PATH.AUTH}?logout=true`;
      }}
      className="font-bold w-full"
      theme="danger"
    >
      로그아웃
    </Button>
  ) : (
    <Button
      icon={<LogIn />}
      onClick={() => {
        router.push(PATH.AUTH);
        setGlobalMenuOpened(false);
      }}
      className="font-bold w-full"
    >
      로그인
    </Button>
  );
};
