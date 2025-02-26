import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { COOKIES } from '@/constants';
import { customCookies } from '@/utils';

export const useOnSessionChanged = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const isLoginNow = customCookies.get(COOKIES.CHANGED_SESSION);

    if (!isLoginNow) return;

    customCookies.remove(COOKIES.CHANGED_SESSION);
    queryClient.clear();
  }, [queryClient]);
};
