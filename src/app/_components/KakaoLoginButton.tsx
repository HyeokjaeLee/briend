'use client';

import { KAKAO } from '@/constants';
import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoLoginButton = () => (
  <Button
    size="large"
    onClick={() => {
      window.location.href = KAKAO.SIGNIN_URL;
    }}
  >
    카카오 로그인
  </Button>
);
