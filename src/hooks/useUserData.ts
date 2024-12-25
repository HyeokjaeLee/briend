import { useSession } from 'next-auth/react';

export const useUserData = () => {
  const session = useSession();

  if (session.data?.user)
    return {
      user: session.data?.user,
      isLoading: false,
      isLogin: true,
    } as const;

  return {
    user: session.data?.user,
    isLoading: session.status === 'loading',
    isLogin: false,
  } as const;
};
