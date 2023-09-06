'use client';

import Image from 'next/image';
import { CheckCircle } from 'react-feather';

import Kakao from '@/assets/Kakao.png';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoLoginButton = () => {
  const { isLoading, kakaoLogin } = useKakaoLogin();
  const isLogin = useAuthStore((state) => state.isLogin);

  return (
    <Button
      size="large"
      onClick={kakaoLogin}
      theme="secondary"
      icon={
        isLogin ? (
          <CheckCircle />
        ) : (
          <Image src={Kakao} alt="kakao-login" className="h-6 w-6" />
        )
      }
      loading={isLoading}
      disabled={isLogin}
      className="w-full"
    >
      카카오 로그인
    </Button>
  );
};
