import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from './useAuthStore';

export const usePathAccessController = (isAuthBined: boolean) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePath = pathname?.split('/')[1] === 'private';

  const isLogin = useAuthStore((state) => state.isLogin);

  useEffect(() => {
    if (isAuthBined && !isLogin && isPrivatePath) router.replace('/');
  }, [isLogin, isPrivatePath, router, isAuthBined]);
};
