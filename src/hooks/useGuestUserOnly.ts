import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export const useGuestUserOnly = () => {
  const router = useRouter();

  const [isLogin, isAuthBined] = useAuthStore(
    (state) => [state.isLogin, state.isBinded],
    shallow,
  );

  useEffect(() => {
    if (isLogin && isAuthBined) router.replace('/');
  }, [isLogin, isAuthBined, router]);
};
