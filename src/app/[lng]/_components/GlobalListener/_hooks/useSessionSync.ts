import { useEffect } from 'react';

import { trpc } from '@/configs/trpc';
import { useUserData } from '@/hooks';

export const useSessionSync = () => {
  const { user, sessionUpdate } = useUserData();

  const { data } = trpc.user.data.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    if (!user || !data) return;

    const { email, name, profileImage, language } = data;

    if (
      user.email !== email ||
      user.name !== name ||
      (user.profileImage || undefined) !== profileImage ||
      user.language !== language
    ) {
      sessionUpdate({
        type: 'update-profile',
        data: {
          ...user,
          email,
          name,
          profileImage: null,
          language,
        },
      });
    }
  }, [data, sessionUpdate, user]);
};
