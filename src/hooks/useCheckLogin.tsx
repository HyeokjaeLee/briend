import { shallow } from 'zustand/shallow';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { useAuthStore } from '@/store/authStore';

export const useCheckLogin = () => {
  const [setId, setIsLogin, setUserName] = useAuthStore(
    (state) => [state.setId, state.setIsLogin, state.setUserName],
    shallow,
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const id = localStorage.getItem(LOCAL_STORAGE_KEY.KAKAO_TOKEN);
    const userName = localStorage.getItem(LOCAL_STORAGE_KEY.USER_NAME);
    if (id && userName) {
      setId(id);
      setUserName(userName);
      setIsLogin(true);
    } else if (pathname && !['/', '/auth'].includes(pathname)) router.push('/');
  }, [pathname, router, setId, setIsLogin, setUserName]);
};
