'use client';

import { LogOut } from 'react-feather';

import { Button } from '@hyeokjaelee/pastime-ui';

export const KakaoLogoutButton = () => (
  <Button
    icon={<LogOut />}
    onClick={() => {
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&logout_redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}?logout=true`;
    }}
    className="font-medium"
    size="large"
    theme="danger"
  >
    Logout
  </Button>
);
