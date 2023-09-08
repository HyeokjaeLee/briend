import { shallow } from 'zustand/shallow';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export const useGuestUserOnly = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePath = pathname?.split('/')[1] === 'private';

  const [isLogin, isAuthBined] = useAuthStore(
    (state) => [state.isLogin, state.isBinded],
    shallow,
  );

  useEffect(() => {
    if (isAuthBined && !isLogin && isPrivatePath) router.replace('/');
  }, [isLogin, isPrivatePath, router, isAuthBined]);
};
