'use client';

import { nanoid } from 'nanoid';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { COOKIES } from '@/constants/cookies-key';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { toast } from '@/utils/toast';

export const LogoutCallback = () => {
  const { t } = useTranslation('layout');
  const [, setCookie] = useCookies([COOKIES.USER_ID]);

  useEffect(() => {
    const isLogouted =
      sessionStorage.getItem(SESSION_STORAGE.LOGOUT_MARK) === 'true';

    if (isLogouted) {
      sessionStorage.removeItem(SESSION_STORAGE.LOGOUT_MARK);

      toast({
        message: t('logout-toast-message'),
      });

      setCookie(COOKIES.USER_ID, nanoid());
    }
  }, [t, setCookie]);

  return <></>;
};
