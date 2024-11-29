import { useEffect } from 'react';

import { SESSION_STORAGE } from '@/constants/storage-key';
import { toast } from '@/utils/toast';

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
