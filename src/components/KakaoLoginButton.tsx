'use client';

import Image from 'next/image';

import Kakao from '@/assets/kakao.png';
import { KAKAO } from '@/constants';
import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoLoginButton = () => (
  <Button
    size="large"
    onClick={() => {
      window.location.href = KAKAO.SIGNIN_URL;
    }}
    iconDirection="right"
    theme="primary"
    icon={<Image src={Kakao} alt="kakao-login" className="h-6 w-6" />}
    className="w-full"
  >
    카카오 로그인
  </Button>
);
