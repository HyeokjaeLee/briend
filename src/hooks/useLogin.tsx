import { shallow } from 'zustand/shallow';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

interface LoginParams {
  userName: string;
  isSaveInfo: boolean;
}

export const useLogin = () => {
  const [setId, id, setUserName, setIsLogin] = useAuthStore(
    (state) => [state.setId, state.id, state.setUserName, state.setIsLogin],
    shallow,
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isIdReady, setIsIdReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams) {
      const code = searchParams.get('code');
      if (code) {
        setId(code);
        router.push('/');
        setIsIdReady(true);
      }
    }
  }, [router, searchParams, setId, toast]);

  useEffect(() => {
    if (isIdReady) {
      toast({
        message: '카카오 인증에 성공했습니다.',
      });
    }
  }, [isIdReady, toast]);

  return {
    isIdReady,
    login: ({ userName, isSaveInfo }: LoginParams) => {
      if (id && userName) {
        if (isSaveInfo) {
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_NAME, userName);
          localStorage.setItem(LOCAL_STORAGE_KEY.KAKAO_TOKEN, id);
        }

        setUserName(userName);
        setIsLogin(true);
        router.push('/private/chat');
        return toast({
          message: '로그인 되었습니다.',
          holdTime: 1000,
        });
      }
      return toast({
        message: '카카오 인증 후 이름을 입력해주세요.',
      });
    },
  };
};
