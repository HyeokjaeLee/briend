import { useSession } from 'next-auth/react';

export const useUserData = () => {
  const session = useSession();
  const { update: sessionUpdate } = session;

  if (session.data?.user)
    return {
      user: session.data?.user,
      isLoading: false,
      isLogin: true,
      sessionUpdate,
    } as const;

  return {
    user: session.data?.user,
    isLoading: session.status === 'loading',
    isLogin: false,
    sessionUpdate,
  } as const;
};
