import { useEffect } from 'react';

import { trpc } from '@/configs/trpc';
import { useUserData } from '@/hooks';

export const useSessionSync = () => {
  const { sessionUpdate } = useUserData();

  const { mutate } = trpc.user.data.useMutation({
    onSuccess: (session) => {
      sessionUpdate({
        type: 'update-profile',
        data: session,
      });
    },
  });

  useEffect(mutate, [mutate]);
};
