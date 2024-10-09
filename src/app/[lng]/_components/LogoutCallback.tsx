'use client';

import { useEffect } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { SESSION } from '@/constants/storage-key';
import { toast } from '@/utils/toast';

export const LogoutCallback = () => {
  const { t } = useTranslation('layout');

  useEffect(() => {
    const isLogouted = sessionStorage.getItem(SESSION.LOGOUT_MARK) === 'true';

    if (isLogouted) {
      sessionStorage.removeItem(SESSION.LOGOUT_MARK);

      toast({
        message: t('logout-toast-message'),
      });
    }
  }, [t]);

  return <></>;
};
