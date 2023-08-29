import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useLogout = () => {
  const { toast } = useToast();

  const [setIsLogin, setId, setUserName] = useAuthStore(
    (state) => [state.setIsLogin, state.setId, state.setUserName],
    shallow,
  );

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.KAKAO_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY.USER_NAME);
    setId(undefined);
    setUserName(undefined);
    setIsLogin(false);
    router.push('/');
    toast({
      message: '로그아웃 되었습니다.',
    });
  };

  return { logout };
};
