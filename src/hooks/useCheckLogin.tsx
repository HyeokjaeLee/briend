import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

export const useCheckLogin = () => {
  const { setId, setIsLogin, setUserName, isLogin } = useAuthStore(
    (state) => state,
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const id = localStorage.getItem('id');
    const userName = localStorage.getItem('userName');

    if (id && userName) {
      setId(id);
      setUserName(userName);
      setIsLogin(true);
    } else if (pathname && !['/', '/auth'].includes(pathname)) router.push('/');
  }, [setId, setIsLogin, setUserName, router, pathname]);

  const logout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    setIsLogin(false);
    router.push('/');
  };

  return { isLogin, logout };
};
