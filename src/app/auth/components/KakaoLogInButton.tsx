'use client';

import Image from 'next/image';

import { useKakaoLogIn } from '@/app/auth/hooks/useKakaoLogIn';
import Kakao from '@/assets/Kakao.png';
import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoLogInButton = () => {
  const { isLoading, kakaoLogIn } = useKakaoLogIn();

  return (
    <Button
      size="large"
      onClick={kakaoLogIn}
      theme="secondary"
      icon={<Image src={Kakao} alt="kakao-login" className="h-6 w-6" />}
      loading={isLoading}
      className="w-full"
    >
      카카오 로그인
    </Button>
  );
};
