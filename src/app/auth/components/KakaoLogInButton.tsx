'use client';

import Image from 'next/image';

import Kakao from '@assets/resources/kakao.png';
import { Button } from '@hyeokjaelee/pastime-ui';

interface KakaoLogInButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export const KakaoLogInButton = ({
  onClick,
  isLoading,
}: KakaoLogInButtonProps) => (
  <Button
    size="large"
    onClick={onClick}
    theme="secondary"
    icon={<Image src={Kakao} alt="kakao-login" className="h-6 w-6" />}
    loading={isLoading}
    className="w-full"
  >
    카카오 로그인
  </Button>
);
