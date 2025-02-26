import { useEffect } from 'react';

import { SESSION_STORAGE } from '@/constants';
import { toast } from '@/utils/client';

export const useRefreshToast = () => {
  useEffect(() => {
    const refreshToast = sessionStorage.getItem(SESSION_STORAGE.REFRESH_TOAST);

    if (refreshToast) {
      sessionStorage.removeItem(SESSION_STORAGE.REFRESH_TOAST);
      toast({
        message: refreshToast,
      });
    }
  }, []);
};
