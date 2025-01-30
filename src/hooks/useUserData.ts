import type { Session } from 'next-auth';

import { useSession } from 'next-auth/react';

import type { SessionUpdateInput } from '@/types/next-auth';

export const useUserData = () => {
  const session = useSession();
  const { update } = session;

  const sessionUpdate = update as (
    input: SessionUpdateInput,
  ) => Promise<Session | null>;

  const user = session.data?.user;

  if (user)
    return {
      user,
      isLoading: false,
      isLogin: true,
      sessionUpdate,
    } as const;

  return {
    user,
    isLoading: session.status === 'loading',
    isLogin: false,
    sessionUpdate,
  } as const;
};
