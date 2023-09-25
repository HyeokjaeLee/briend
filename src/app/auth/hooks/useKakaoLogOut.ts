import { shallow } from 'zustand/shallow';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useKakaoLogOut = () => {
  const searchParams = useSearchParams();
  const [setUserId, setUserName] = useAuthStore(
    (state) => [state.setUserId, state.setUserName],
    shallow,
  );
  const isLogOut = searchParams?.get('logout') === 'true';

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isLogOut) {
      setUserId(null);
      setUserName(null);
      router.replace('/auth');
      toast({
        message: '로그아웃 되었습니다.',
      });
    }
  }, [isLogOut, router, setUserId, setUserName, toast]);

  return {
    isLogOut,
  };
};
