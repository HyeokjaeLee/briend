import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/authStore';

export const useLogin = () => {
  const { setId, id, setIsLogin, setUserName } = useAuthStore((state) => state);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSetting, setIsSetting] = useState(true);

  useEffect(() => {
    if (searchParams) {
      const code = searchParams.get('code');
      if (code) {
        setId(code);
        router.push('/auth');
        setIsSetting(false);
      } else if (!id) router.push('/');
    }
  }, [id, router, searchParams, setId]);

  return {
    isSetting,
    login: (userName: string) => {
      if (id && userName) {
        localStorage.setItem('userName', userName);
        localStorage.setItem('id', id);
        setUserName(userName);
        setIsLogin(true);
        router.push('/private/chat');
        return true;
      }
      return false;
    },
  };
};
